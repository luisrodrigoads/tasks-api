import express,{Application} from "express";
import * as bodyParser from "body-parser";
import { createConnection } from "typeorm";
import taskRouter from "./routes/tasks";

createConnection().then((connection) => {

    const app: Application = express();
    app.use(bodyParser.json());

    app.use('/tasks', taskRouter); 
   
    app.listen(3000,()=>{
        console.log(`Server is running`);
    });
});