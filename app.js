import express from "express";
import { authRouter } from "./src/routers/auth.route.js";
import { userRouter } from "./src/routers/user.route.js";
import { momentRouter } from "./src/routers/moment.route.js";
import { friendRouter } from "./src/routers/friend.route.js";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);
app.use(userRouter);
app.use(momentRouter);
app.use(friendRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
