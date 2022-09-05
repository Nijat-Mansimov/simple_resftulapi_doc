const express = require("express");
require("./db/dbConnection");
const userRouter = require("./router/userRouter")
const errorMiddleware = require("./middleware/errorMiddleware");
0
const app = express();

app.use(express.json());
// app.use(express.urlencoded());

app.use("/api/users", userRouter);

app.get("/", (req, res)=>{
    res.status(200).json({
        "message": "Hello World"
    })
});

app.use(errorMiddleware);

PORT = 3000

app.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`);
});