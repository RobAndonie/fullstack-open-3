const express = require("express");
const router = express.Router();

const {
  getPersons,
  getPerson,
  createPerson,
  updatePerson,
  deletePerson,
} = require("./controllers");

router.get("/", getPersons);
router.get("/:id", getPerson);
router.post("/", createPerson);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

module.exports = router;
