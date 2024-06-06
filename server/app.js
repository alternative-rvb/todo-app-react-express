// /server/app.js

const express = require("express");
const app = express();

const PORT= process.env.PORT || 8080


app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}\nvia http://localhost:8080`);
})

app.use(express.static("dist"));

// Database

const todos = [
    {
        id: 1,
        title: "Buy milk",
        completed: false,
    },
    {
        id: 2,
        title: "Buy eggs",
        completed: false,
    },
    {
        id: 3,
        title: "Buy bread",
        completed: false,
    },
];

app.get("/api/tasks", (req, res) => {  
    // Express converts the todos array to JSON and sends it back to the client
    res.send(todos);
});