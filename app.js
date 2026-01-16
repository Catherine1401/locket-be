import express from "express";
import { authRouter } from "./src/routers/auth.route.js";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
