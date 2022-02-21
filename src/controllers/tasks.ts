import {Request, Response} from "express";
import moment from "moment";
import { getRepository, getConnection,  } from "typeorm";
import { Task } from "../entity/Task";

/*
--Create task function--
body request example
{
    "description":"description task ",
    "deadline_at":"2022-02-25T23:18:19"
}
*/
export const createTask = async (req: Request, res: Response) => {

    let task = new Task();
    task = {...req.body};

    task.created_at =  new Date();
    
    const taskRepository = getRepository(Task);
    
    await taskRepository.save(task);
    res.send(task);
}

/*
--Get tasks function--
url example
localhost:3000/tasks/currentPage/tasksPerPage
*/
export const getTasks = async (req: Request, res: Response) => {
    
    let skip = (Number(req.params.currentPage) - 1) * Number(req.params.tasksPerPage);
   
    const taskRepository = getRepository(Task);

    // verify if task is late
    await getConnection()
        .createQueryBuilder()
        .update(Task)
        .set({isLate: true})
        .where("deadline_at < :date",{date: moment().format('YYYY-MM-DD HH:mm:ss')})
        .execute();

    // show tasks
    const tasks = await taskRepository
        .createQueryBuilder("task")
        .skip(Number(skip))
        .take(Number(req.params.tasksPerPage))
        .getMany();

    if(!tasks){
        res.send('Nao há tarefas cadastrados');
    } else {
        res.send(tasks);
    } 
   
}

/*
--Update task(description and deadline_at) function--
must have in the body on the request values 
of description and deadline_at
*/
export const updateTask = async (req: Request, res: Response) => {
    const {description, deadline_at} = req.body;

    const taskRepository = getRepository(Task);

    const currentTask = await taskRepository.findOne({
        id: Number(req.params.id)
    });

    if(currentTask.isFinished){
        res.send('task is ended, cannot be changed');

    }else{
        await taskRepository.update(Number(req.params.id), {
            description,
            deadline_at
        });
    
        const updatedTask = await taskRepository.find({
            id: Number(req.params.id)
        });
    
        res.send(updatedTask);
    }

}

/*
--End task function--
*/
export const endTask = async (req: Request, res: Response) => {

    const taskRepository = getRepository(Task);

    var isFinished = true;

    await taskRepository.update(Number(req.params.id), {
        isFinished
    })

    const endedTask = await taskRepository.findOne({
        id: Number(req.params.id)
    })

    var finished_at = endedTask.updated_at;
    await taskRepository.update(Number(req.params.id), {
       finished_at
    })

    const endedTaskResult = await taskRepository.findOne({
        id: Number(req.params.id)
    })

    res.send(`task finished at ${endedTaskResult.finished_at}`);
}

/*
--Delete task function--
*/
export const deleteTask = async (req: Request, res: Response) => {

    const taskRepository = getRepository(Task);

    const task = await taskRepository.find({
        id: Number(req.params.id)
    })

    await taskRepository.remove(task);

    res.send(`task id ${req.params.id} has been deleted.`);
}