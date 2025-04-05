import express from 'express';
import { 
  createProject, 
  getUserProjects, 
  getProjectById, 
  updateProject, 
  deleteProject 
} from '../controllers/project.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(verifyToken);


router.post('/', createProject);

router.get('/', getUserProjects);

router.get('/:projectId', getProjectById);

router.put('/:projectId', updateProject);

router.delete('/:projectId', deleteProject);

export default router; 