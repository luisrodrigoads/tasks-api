import {Request, Response} from "express";
import { getRepository, createQueryBuilder } from "typeorm";
import { Task } from "../entity/Task";

export const createTask = async (req: Request, res: Response) => {

    let task = new Task();
    task = {...req.body};

    const taskRepository = getRepository(Task);
    
    await taskRepository.save(task);
    res.send(task);
}

export const getTasks = async (req: Request, res: Response) => {
    
    let skip = (Number(req.params.currentPage) - 1) * Number(req.params.tasksPerPage);
   
    const taskRepository = getRepository(Task);

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

export const deleteTask = async (req: Request, res: Response) => {

    const taskRepository = getRepository(Task);

    const task = await taskRepository.find({
        id: Number(req.params.id)
    })

    await taskRepository.remove(task);

    res.send(`task id ${req.params.id} has been deleted.`);
}