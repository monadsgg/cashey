import express from "express";
import bodyParser from "body-parser";
import prisma from "./prismaClient.js";

const app = express();
const port = process.env.PORT || 5003;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/users", async (req, res) => {
  const allUsers = await prisma.user.findMany();

  res.json(allUsers);
});

app.listen(port, () => {
  console.log(`APP running on port ${port}.`);
});
