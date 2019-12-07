import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Students';

class HelpOrderController {
  /**
   * Create a help order
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Invalid input data' });
    }

    const { student_id } = req.params;
    const { question } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res
        .status(401)
        .json({ error: 'Only students can send questions' });
    }

    const Help = await HelpOrder.create({
      student_id,
      question,
    });

    return res.json(Help);
  }

  /**
   * List a specific help order
   */
  async index(req, res) {
    const { page = 1 } = req.query;
    const { student_id } = req.params;
    const helpOrders = await HelpOrder.findByPk(student_id, {
      order: [['id', 'ASC']],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
    });

    return res.json(helpOrders);
  }

  /**
   * List all help orders
   */

  async show(req, res) {
    const { page = 1 } = req.query;
    const helpOrders = await HelpOrder.findAll({
      order: [['id', 'ASC']],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
    });

    return res.json(helpOrders);
  }
}

export default new HelpOrderController();
