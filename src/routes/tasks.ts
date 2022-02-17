import express, { Router } from "express";
import { 
    createTask, 
    deleteTask, 
    endTask, 
    getTasks, 
    updateTask 
} from "../controllers/tasks";

const router: Router = express.Router();

//baseurl = localhost:3000/tasks

router.get('/:currentPage/:tasksPerPage', getTasks); //(get) baseurl/currentPage/tasksPerPage
router.post('/', createTask); //(post) baseurl/
router.put('/:id', updateTask); // (put) baseurl/id
router.put('/end/:id', endTask);  // (put) baseurl/end/id
router.delete('/:id', deleteTask); // (delete) baseurl/id

export default router;