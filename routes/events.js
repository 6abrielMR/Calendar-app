const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidators } = require("../middlewares/field-validators");
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { isDate } = require("../helpers/isDate");

const router = Router();

router.use(jwtValidator);

router.get("/", getEvents);
router.post(
  "/",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Ingresa una fecha de inicio válida").custom(isDate),
    check("end", "Ingresa una fecha de finalización válida").custom(isDate),
    fieldValidators,
  ],
  createEvent
);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
