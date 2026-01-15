const express = require("express");
const app = express();
const port = process.env.PORT ?? 3000;

const { auth } = require("./src/middlewares/auth.middleware");
const authRouter = require("./src/routers/auth.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
