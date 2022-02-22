import joi from "joi";

export const createOrUpdateTaskData = joi.object({
    description: joi.string().min(5).required(),
    deadlineAt: joi.date().required()
});

export const endOrDeleteTaskData = joi.object({
    id: joi.number().required()
})

export const getTasksData = joi.object({
    currentPage: joi.number().required(),
    tasksPerPage: joi.number().required()
})