const express = require("express");
const cors = require("cors");

const { port } = require("./env");
const {
  login,
  getTurnsByDate,
  createTurns,
  editTurn,
  deleteTurn,
} = require("./database");
const {
  getDate,
  nextDayDate,
  prevDayDate,
  getDateRange,
  getTimeRange,
} = require("./moment");
const { generateTurnsByDate } = require("./turn");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/getDate/:date?/:format?", async (req, res, next) => {
  const date = req.params.date;
  const format = req.params.format;
  try {
    const result = getDate(date, format);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

app.get("/nextDayDate/:date?/:format?", async (req, res, next) => {
  const date = req.params.date;
  const format = req.params.format;
  try {
    const result = nextDayDate(date, format);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

app.get("/prevDayDate/:date?/:format?", async (req, res, next) => {
  const date = req.params.date;
  const format = req.params.format;
  try {
    const result = prevDayDate(date, format);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

app.get(
  "/getDateRange/:startDate?/:endDate?/:format?",
  async (req, res, next) => {
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const format = req.params.format;
    try {
      const result = getDateRange(startDate, endDate, format);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  "/getTimeRange/:startTime?/:endTime?/:periodInMinute?/:format?",
  async (req, res, next) => {
    const startTime = req.params.startTime;
    const endTime = req.params.endTime;
    const periodInMinute = req.params.periodInMinute;
    const format = req.params.format;
    try {
      const result = getTimeRange(startTime, endTime, periodInMinute, format);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

app.get("/generateTurnsByRange", async (req, res, next) => {
  const qp = req.query.rangeList;
  const rangeList = qp ? JSON.parse(qp) : [];
  try {
    let turnsList = [];
    rangeList.forEach((item) =>
      turnsList.push(
        ...generateTurnsByDate(
          item?.date,
          item?.startTime,
          item?.endTime,
          item?.periodInMinute
        )
      )
    );
    const result = turnsList.length > 0 ? turnsList : generateTurnsByDate();
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const user = await login(req.body);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

app.post("/turns", async (req, res, next) => {
  try {
    const turns = await createTurns(req.body);
    res.status(201).send(turns);
  } catch (error) {
    next(error);
  }
});

app.get("/turnsByDate/:date?", async (req, res, next) => {
  try {
    const date = req.params.date;
    const turns = await getTurnsByDate(date);
    res.status(200).send(turns);
  } catch (error) {
    next(error);
  }
});

app.get("/", async (req, res, next) => {
  res.status(200).send({ message: "everything is OK" });
});

app.put("/turn/:id/edit", async (req, res, next) => {
  try {
    const id = req.params.id;
    const turn = await editTurn(id, req.body);
    res.status(200).send(turn);
  } catch (error) {
    next(error);
  }
});

app.delete("/turn/:id/delete", async (req, res, next) => {
  try {
    const id = req.params.id;
    const turn = await deleteTurn(id);
    res.status(200).send(turn);
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
