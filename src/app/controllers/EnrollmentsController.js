import * as Yup from 'yup';
import { parseISO, addMonths, isBefore } from 'date-fns';
import Student from '../models/Students';
import Plans from '../models/Plans';
import Enrollment from '../models/Enrollments';
import Queue from '../../lib/Queue';
import EnrollmentMail from '../../jobs/EnrollmentMail';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Invalid input data' });
    }

    const { student_id } = req.params;
    const { plan_id, start_date } = req.body;

    /**
     * Verifying if student exists
     */

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'This student does not exists' });
    }

    /**
     * Verifying if plan exists
     */

    const plan = await Plans.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'This plan does not exists' });
    }

    /**
     * Verifying if start date does not is a past date
     */

    const presentDate = parseISO(start_date);

    if (isBefore(presentDate, new Date())) {
      return res.status(401).json({ error: 'Past dates are not permitted' });
    }

    const end_date = addMonths(presentDate, plan.duration);
    const price = plan.price * plan.duration;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    const createdEnrollment = await Enrollment.findByPk(enrollment.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plans,
          as: 'plan',
          attributes: ['title', 'duration'],
        },
      ],
    });

    await Queue.add(EnrollmentMail.key, { createdEnrollment });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Invalid input data' });
    }

    const { plan_id, start_date } = req.body;
    const { enrollment_id } = req.params;

    /**
     * Verify if plan exists
     */

    const plan = await Plans.findByPk(plan_id);

    if (!plan) {
      return res.status(401).json({ error: 'Plan does not exist' });
    }

    /**
     * Verify if start date does not is a past date
     */

    const presentDate = parseISO(start_date);

    if (isBefore(presentDate, new Date())) {
      return res.status(401).json({ error: 'Past dates are not permitted' });
    }

    const end_date = addMonths(presentDate, plan.duration);
    const price = plan.price * plan.duration;
    const enrollment = await Enrollment.findByPk(enrollment_id);

    if (!enrollment) {
      return res.status(401).json({ error: 'This enrollment does not exists' });
    }

    return res.json(
      await enrollment.update({
        plan_id,
        start_date,
        end_date,
        price,
      })
    );
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const enrollments = await Enrollment.findAll({
      order: [['id', 'ASC']],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
        {
          model: Plans,
          as: 'plan',
          attributes: ['title'],
        },
      ],
    });

    return res.json(enrollments);
  }

  async show(req, res) {
    const enrollments = await Enrollment.findOne({
      include: [
        {
          model: Student,
          as: 'student',
          where: { name: req.params.name },
          attributes: ['name'],
        },
        {
          model: Plans,
          as: 'plan',
          attributes: ['title'],
        },
      ],
    });

    return res.json(enrollments);
  }

  async delete(req, res) {
    const { enrollment_id } = req.params;

    const enrollment = await Enrollment.findByPk(enrollment_id);

    if (!enrollment) {
      return res.status(401).json({ error: 'Enrollment does not exists' });
    }

    await Enrollment.destroy({ where: { id: enrollment_id } });

    return res.json({ message: 'Enrollment sucessfully deleted' });
  }
}

export default new EnrollmentController();
