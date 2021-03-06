import Sequelize from 'sequelize';
import User from '../app/models/User';
import Students from '../app/models/Students';
import Plans from '../app/models/Plans';
import databaseConfig from '../config/database';
import Enrollments from '../app/models/Enrollments';
import Checkin from '../app/models/Checkin';
import HelpOrder from '../app/models/HelpOrder';

const models = [User, Students, Plans, Enrollments, Checkin, HelpOrder];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));

    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
