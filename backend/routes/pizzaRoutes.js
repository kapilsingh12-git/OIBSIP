import express from 'express';
import {
  getPizzas,
  getPizzaById,
  getPizzaOptions,
  createPizza,
  updatePizza,
  deletePizza,
    createPizzaOption,  
  deletePizzaOption,   
} from '../controllers/pizzaController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/options', getPizzaOptions); // must come before /:id to avoid route conflict
router.get('/', getPizzas);
router.get('/:id', getPizzaById);
router.post('/', protect, isAdmin, upload.single('image'), createPizza);
router.put('/:id', protect, isAdmin, upload.single('image'), updatePizza);
router.delete('/:id', protect, isAdmin, deletePizza);
router.post('/options', protect, isAdmin, createPizzaOption);
router.delete('/options/:id', protect, isAdmin, deletePizzaOption);

export default router;