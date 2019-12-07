import * as Yup from 'yup';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(401).json({ error: 'Invalid input data' });
    }

    const { student_id } = req.params;

    const today = Number(new Date());
    const startDate = Number(subDays(today, 7));
    const lastCheck = await Checkin.findAll({
      where: {
        student_id,
        created_at: { [Op.between]: [startOfDay(startDate), endOfDay(today)] },
      },
    });

    if (lastCheck && lastCheck.length >= 5) {
      return res
        .status(401)
        .json({ error: 'No more than 5 checkin per week allowed' });
    }

    const checkin = await Checkin.create({ student_id });

    return res.json(checkin);
  }

  async index(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(401).json({ error: 'Invalid input data' });
    }

    const { student_id } = req.params;

    const checkin = await Checkin.findAll({ where: { student_id } });

    return res.json(checkin);
  }
}

export default new CheckinController();
