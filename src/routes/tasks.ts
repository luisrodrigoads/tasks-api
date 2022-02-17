import express, { Router } from "express";
import { 
    createTask, 
    deleteTask, 
    endTask, 
    getAllTasks, 
    updateTask 
} from "../controllers/tasks";

const router: Router = express.Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.put('/end/:id', endTask); 
router.delete('/:id', deleteTask);

export default router;