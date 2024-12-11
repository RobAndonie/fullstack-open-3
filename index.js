const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let phonebook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/persons", (req, res) => {
  res.json(phonebook);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phonebook.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  console.log(body);

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number is missing",
    });
  }

  if (phonebook.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "Name must be unique",
    });
  }

  const person = {
    id: Math.floor(Math.random() * 1000),
    name: body.name,
    number: body.number,
  };

  phonebook = phonebook.concat(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  phonebook = phonebook.filter((person) => person.id !== id);
  res.status(204).end();
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${phonebook.length} people</p>
    <p>${date}</p>`
  );
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
