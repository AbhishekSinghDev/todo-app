import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";


const app = express();
const port = 3000;

// connecting to db using mongoose
// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
dotenv.config({ silent: process.env.NODE_ENV === 'production' });

mongoose.connect(`mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@cluster0.ll2t0mu.mongodb.net/todolistDB`);

const todolistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

const todoModel = mongoose.model("personal_task", todolistSchema);
const todoModelWork = mongoose.model("work_task", todolistSchema);

const dTask1 = new todoModel({
    name: "Get drink",
});
const dTask2 = new todoModel({
    name: "Exam preparation",
});
const dTask3 = new todoModel({
    name: "Web dev project",
});

// await todoModel.insertMany([dTask1, dTask2, dTask3]);
// await todoModelWork.insertMany([dTask1, dTask2, dTask3]);
// console.log("defualt insertion done");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

let date = new Date();

app.get("/", async (req, res) => {
    let today = day(date.getDay());
    let today_date = date.getDate();
    let current_year = date.getFullYear();

    let day_title = `${today} ${today_date}, ${current_year}`;

    // Reading personal task from db
    const pTaskList = await todoModel.find(); 
    // console.log(pTaskList);

    res.render("personalTask.ejs", {
        taskList: pTaskList,
        title: day_title
    });
});

app.post("/delete-personal", async (req, res) => {
    const id = req.body.checkbox;
    const deleteTask = await todoModel.deleteOne({_id: id});
    
    // console.log(deleteTask);
    res.redirect("/");
});
app.post("/delete-work", async (req, res) => {
    const id = req.body.checkbox;
    const deleteTask = await todoModelWork.deleteOne({_id: id});

    // console.log(deleteTask);
    res.redirect("/workTask");
})

app.get("/workTask", async (req, res) => {
    let today = day(date.getDay());
    let today_date = date.getDate();
    let current_year = date.getFullYear();

    let day_title = `${today} ${today_date}, ${current_year}`;

    const workTasks = await todoModelWork.find();

    res.render("workTask.ejs", {
        taskList: workTasks,
        title: day_title
    });
})

app.post("/add-personal", (req, res) => {
    let task = req.body.task;
    const personalTask = new todoModel({
        name: task,
    })
    if(task != '') {
        // personalData.push(task);
        personalTask.save();
    }

    res.redirect("/");
})

app.post("/add-work", (req, res) => {
    let task = req.body.task;
    const workTask = new todoModelWork({
        name: task,
    });
    if(task != '') {
        // workData.push(task);
        workTask.save();
    }

    res.redirect("/workTask");
})

function day(num) {
    switch(num) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "";
    }
}