require("dotenv").config();

const express = require("express");
const routes = require("./src/routes");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${Person.length} people</p>
    <p>${date}</p>`
  );
});

app.use("/api/persons", routes);

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res
      .status(400)
      .send({ error: `Malformatted id, ${error.message} ` });
  } else if (error.name === "ValidationError") {
    return res
      .status(400)
      .json({ error: `Validation error, ${error.message}` });
  } else {
    return res
      .status(500)
      .json({ error: `Internal server error, ${error.message}` });
  }
};

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
