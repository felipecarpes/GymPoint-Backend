import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';
import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/students', StudentsController.store);
routes.put('/students', StudentsController.update);

routes.use(AuthMiddleware);
routes.post('/sessions', SessionController.store);

export default routes;
