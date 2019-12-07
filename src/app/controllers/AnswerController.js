import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Students';
import Queue from '../../lib/Queue';
import AnswerMail from '../../jobs/AnswerMail';

class AnswerController {
  /**
   * Answer a help order
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Invalid input data' });
    }

    const { help_order_id } = req.params;

    const helpOrder = await HelpOrder.findByPk(help_order_id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!helpOrder || helpOrder.answer_at !== null) {
      return res.status(400).json({
        error: 'This help order does not exists or has already answered',
      });
    }

    const answered = await helpOrder.update({
      ...HelpOrder,
      answer: req.body.answer,
      answer_at: new Date(),
    });

    await Queue.add(AnswerMail.key, { helpOrder });

    return res.json(answered);
  }

  /**
   * List all not answered help orders
   */

  async show(req, res) {
    const { page = 1 } = req.query;
    const ntAnswered = await HelpOrder.findAll({
      where: {
        answer: null,
      },
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

    return res.json(ntAnswered);
  }
}
export default new AnswerController();
