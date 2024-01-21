import dotenv from "dotenv"
import { connection } from "./db/db.js"
import { app } from "./app.js"


dotenv.config()

connection()
.then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`The app is listen on the port ${process.env.PORT}`);
    })
}).catch((error)=>{
    console.log("Unknow error is coming",error)
    throw error;
})