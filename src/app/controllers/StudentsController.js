import * as Yup from 'yup';
import Students from '../models/Students';

class StudentsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .positive()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'invalid input data' });
    }

    const studentExist = await Students.findOne({
      where: { email: req.body.email },
    });

    if (studentExist) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const { name, email, age, weight, height } = await Students.create(
      req.body
    );

    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }

  // update student

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .positive()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Invalid input data' });
    }
    const { email } = req.body;

    const studentExists = await Students.findOne({
      where: { email },
    });

    if (!studentExists) {
      return res.status(400).json({ error: 'Student does not exists' });
    }
    const { id, name, age, weight, height } = await studentExists.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentsController();
