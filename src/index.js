require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDatabase = require("./database/database");
const userRoute = require("./users/users.route");
const authRoute = require("./auth/auth.route");
const jwtVerify = require("./auth/auth.middleware");

const port = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

connectDatabase();

app.get("/",jwtVerify, (req, res) => {
    res.send({ message: "Hello, world!" });
});

app.use("/users", userRoute);

app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});