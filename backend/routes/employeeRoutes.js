import { Router } from 'express';
const router = Router();
import { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee } from '../controllers/employeeController.js';

router.post('/', createEmployee);        // CREATE
router.get('/', getAllEmployees);        // READ ALL (with optional ?status=Active)
router.get('/:id', getEmployeeById);     // READ ONE
router.put('/:id', updateEmployee);      // UPDATE
router.delete('/:id', deleteEmployee);   // DELETE

export default router;
