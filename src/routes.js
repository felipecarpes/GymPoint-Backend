import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';
import PlansController from './app/controllers/PlansController';
import EnrollmentsController from './app/controllers/EnrollmentsController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerController from './app/controllers/AnswerController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// Create/Update/List Students Register
routes.post('/students', StudentsController.store);
routes.put('/students', StudentsController.update);
routes.get('/students', StudentsController.index);

// Create/Update/List/Delete Plans
routes.post('/plans', PlansController.store);
routes.put('/plans', PlansController.update);
routes.get('/plans', PlansController.index);
routes.delete('/plans/:id', PlansController.delete);

// Create a session
routes.post('/sessions', SessionController.store);

// Create/Update/List/Delete Enrollments
routes.post('/enrollment/:student_id', EnrollmentsController.store);
routes.put('/enrollment/:enrollment_id', EnrollmentsController.update);
routes.get('/enrollment', EnrollmentsController.index);
routes.get('/enrollment/:name', EnrollmentsController.show);
routes.delete('/enrollment/:enrollment_id', EnrollmentsController.delete);

// Create/List Checkins
routes.post('/checkin/:student_id', CheckinController.store);
routes.get('/checkin/:student_id', CheckinController.index);

// Create/List all and a Question(s)
routes.post('/helporder/:student_id', HelpOrderController.store);
routes.get('/helporder/:student_id', HelpOrderController.index);
routes.get('/helporder', HelpOrderController.show);

// Create Answer ...  List not answered help orders
routes.post('/help-order/:help_order_id/answer', AnswerController.store);
routes.get('/help-order/answer', AnswerController.show);

export default routes;
