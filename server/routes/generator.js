import express from 'express';
import { generateCode } from '../controllers/generatorController.js';

const router = express.Router();

router.post('/generate', generateCode);

export default router; 