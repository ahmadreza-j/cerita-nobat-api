const express = require("express");
const cors = require("cors");

const { port, authVerify } = require("./env");
const {
  login,
  getTurnById,
  getTurnsByDate,
  createTurns,
  editTurn,
  deleteTurn,
  setTurnStatus,
} = require("./database");
const { Err } = require("./error");
const { sendSubmitTurnInfoSms, sendCommentSms } = require("./sms");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/login", async (req, res, next) => {
  try {
    const user = await login(req.body);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  try {
    const token = req.headers.authorization;
    const pattern = new RegExp(authVerify, "g");
    const isValid = pattern.test(token);
    if (!isValid) throw new Err(401, "خطای دسترسی");
    next();
  } catch (error) {
    next(error);
  }
});

// app.get("/", async (req, res, next) => {
//   res.status(200).send({ message: "everything is OK" });
// });

app.get("/turns/:rdate?/:cdate?", async (req, res, next) => {
  try {
    const cdate = req.params.cdate;
    const rdate = req.params.rdate || "now";
    const turns = await getTurnsByDate(rdate, cdate);
    res.status(200).send(turns);
  } catch (error) {
    next(error);
  }
});

app.post("/turn", async (req, res, next) => {
  try {
    const newTurn = await createTurns(req.body);
    sendSubmitTurnInfoSms(req.body.date, req.body.refphone);
    res.status(201).send(newTurn);
  } catch (error) {
    next(error);
  }
});

app.put("/turn", async (req, res, next) => {
  try {
    const turn = await editTurn(req.body);
    sendSubmitTurnInfoSms(req.body.date, req.body.refphone);
    res.status(200).send(turn);
  } catch (error) {
    next(error);
  }
});

app.delete("/turn/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const turn = await deleteTurn(id);
    res.status(200).send(turn);
  } catch (error) {
    next(error);
  }
});

app.put("/commentSms/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const turn = await getTurnById(id);
    await sendCommentSms(turn.refphone);
    const updatedTurn = await setTurnStatus(id, "commentSms");

    res.status(200).send(updatedTurn);
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  res.status(err.code || 500).send({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
