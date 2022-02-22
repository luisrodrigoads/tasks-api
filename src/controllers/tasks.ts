import {Request, Response} from "express";
import moment from "moment";
import { getRepository, getConnection } from "typeorm";
import { Task } from "../entity/Task";
import joi from "joi";
import { createOrUpdateTaskData } from "./validDataRequest";

/*
--Create task function--
body request example
{
    "description":"description task ",
    "deadlineAt":"2022-02-25T23:18:19"
}
*/
export const createTask = async (req: Request, res: Response) => {

    let task = new Task();

    const {error, value} = createOrUpdateTaskData.validate(req.body);
    if(error){
        res.status(400).send({error: error.details[0].message});
    }else{
        task = {...req.body};

        task.createdAt =  new Date();
        
        const taskRepository = getRepository(Task);
        
        await taskRepository.save(task);
        res.status(200).send(task);
    }
}

/*
--Get tasks function--
url example
localhost:3000/tasks/currentPage/tasksPerPage
*/
export const getTasks = async (req: Request, res: Response) => {

    const { currentPage,tasksPerPage } = req.params;
    
    let skip = (Number(currentPage) - 1) * Number(tasksPerPage);
   
    const taskRepository = getRepository(Task);
    const today = moment().format('YYYY-MM-DD HH:mm:ss')

    try {
        // verify if task is late
        await getConnection()
            .createQueryBuilder()
            .update(Task)
            .set({isLate: true})
            .where("deadlineAt < :today AND isFinished = :isFinished",{today: today , isFinished: false})
            .execute();

    } catch (error) {
        res.status(400).send({error: error})
    }

    try {
        // show tasks
    const tasks = await taskRepository
        .createQueryBuilder("task")
        .skip(Number(skip))
        .take(Number(tasksPerPage))
        .getMany();

        if(!tasks){
            res.status(200).send({message: 'There are no tasks registered'});
        } else {
            res.status(200).send(tasks);
        } 
        
    } catch (error) {
        res.status(400).send({error: error});
    }

    
   
}

/*
--Update task(description and deadline_at) function--
must have in the body on the request values 
of description and deadline_at
*/
export const updateTask = async (req: Request, res: Response) => {
    const {description, deadlineAt} = req.body;
    const {id} = req.params;

    const taskRepository = getRepository(Task);

    try {

            const currentTask = await taskRepository.findOne({
                id: Number(id)
            });
        
            if(currentTask.isFinished){
                res.status(400).send({message: 'task is ended, cannot be changed'});
        
            }else{
    
                const today = moment().format('YYYY-MM-DD HH:mm:ss')
                const isLate = false;

                const {error, value} = createOrUpdateTaskData.validate(req.body);

                if(error){
                    res.status(400).send({error: error.details[0].message});
                }else{
        
                    if(deadlineAt > today){
        
                        await taskRepository.update(Number(id), {
                            description,
                            deadlineAt,
                            isLate
                        });
                    
                    } else {
        
                        await taskRepository.update(Number(id), {
                            description,
                            deadlineAt
                        });
                    }
    
                    const updatedTask = await taskRepository.find({
                        id: Number(id)
                    });
                
                    res.status(200).send(updatedTask);

                }
            }
        
    } catch (error) {
        res.status(400).send({error: error})
    }

}

/*
--End task function--
*/
export const endTask = async (req: Request, res: Response) => {

    const taskRepository = getRepository(Task);
    const {id} = req.params;

    const isFinished = true;
    const isLate = false;

    try {

        await taskRepository.update(Number(id), {
            isFinished,
            isLate
        })
    
        const endedTask = await taskRepository.findOne({
            id: Number(id)
        })
    
        const finishedAt = endedTask.updatedAt;
        await taskRepository.update(Number(id), {
           finishedAt
        })
    
        const endedTaskResult = await taskRepository.findOne({
            id: Number(id)
        })
    
        res.status(200).send({message: `task finished at ${endedTaskResult.finishedAt}`}); 

    } catch (error) {
        res.status(400).send({error: error})
    }

}

/*
--Delete task function--
*/
export const deleteTask = async (req: Request, res: Response) => {

    const taskRepository = getRepository(Task);
    const {id} = req.params;

    try {

        const task = await taskRepository.find({
            id: Number(id)
        })

        console.log(task);
        if(task.length === 0)
            res.status(400).send({message: 'Task not exists'})
    
        await taskRepository.remove(task);
    
        res.status(200).send({message:`task with id ${id} has been deleted.`});

    } catch (error) {
        res.status(400).send({error: error})
    }

}