import {Request, Response} from "express";
import { getRepository } from "typeorm";
import { Task } from "../entity/Task";

export const createTask = async (req: Request, res: Response) => {
    let task = new Task();
    task = {...req.body};

    const taskRepository = getRepository(Task);
    
    await taskRepository.save(task);
    res.send(task);
}

export const getAllTasks = async (req: Request, res: Response) => {
    const taskRepository = getRepository(Task);

    const tasks = await taskRepository.find();

    if(!tasks){
        res.send('Nao há dados cadastrados');
    } else {
        res.send(tasks);
    } 
   
}

export const updateTask = async (req: Request, res: Response) => {
    const {name, description} = req.body;

    const taskRepository = getRepository(Task);

    await taskRepository.update(Number(req.params.id), {
        name,
        description
    });

    const updatedTask = await taskRepository.find({
        id: Number(req.params.id)
    });

    res.send(updatedTask);
}

export const deleteTask = async (req: Request, res: Response) => {
    const taskRepository = getRepository(Task);

    const task = await taskRepository.find({
        id: Number(req.params.id)
    })

    await taskRepository.remove(task);

    res.send(`tASK id ${req.params.id} has been deleted.`);
}