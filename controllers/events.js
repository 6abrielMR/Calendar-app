const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req, res = response) => {
  const events = await Event.find().populate("user", "name");

  res.json({
    ok: true,
    events,
  });
};

const createEvent = async (req, res = response) => {
  const event = new Event(req.body);

  try {
    event.user = req.uid;
    await event.save();

    res.json({
      ok: true,
      event,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const updateEvent = async (req, res = response) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "El evento no existe",
      });
    }

    if (event.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de editar este evento",
      });
    }

    const newEvent = {
      ...req.body,
      user: req.uid,
    };

    const eventUpdated = await Event.findByIdAndUpdate(id, newEvent, {
      new: true,
    });

    res.json({
      ok: true,
      event: eventUpdated,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const deleteEvent = async (req, res = response) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "El evento no existe",
      });
    }

    if (event.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de eliminar este evento",
      });
    }

    const eventDeleted = await Event.findByIdAndDelete(id);

    res.json({
      ok: true,
      event: eventDeleted,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
