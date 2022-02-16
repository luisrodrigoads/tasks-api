import express, { Router } from "express";
import { 
    createTask, 
    deleteTask, 
    getAllTasks, 
    updateTask 
} from "../controllers/tasks";

const router: Router = express.Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;