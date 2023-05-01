const express = require("express");
const { NoteModel } = require("../models/note.model");
var jwt = require("jsonwebtoken");
const noteRouter = express.Router();

//get notes
noteRouter.get("/", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "masai");
  try {
    const note = await NoteModel.find({ userID: decoded.userID });
    res.status(200).send(note);
  } catch (error) {
    res.status(400).send({ msg: error.message })
  }
});

//add notes
noteRouter.post("/addnote", async (req, res) => {
  try {
    const note = new NoteModel(req.body);
    await note.save();
    res.status(200).send({ msg: "A new note is added" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

//update notes
noteRouter.patch("/updatenote/:noteID", async (req, res) => {
  const payload = req.body;
  const noteID = req.params.noteID;
  try {
    await NoteModel.findByIdAndUpdate({ _id: noteID }, payload);
    res.status(200).send({ msg: "Note has been updated" });
  } catch (err) {
    res.status(400).send({ msg: error.message });
  }
});

//delete notes
noteRouter.delete("/deletenote/:noteID", async (req, res) => {
  const token = req.headers.authorization;
  const noteID = req.params.noteID;
  const decoded = jwt.verify(token, "masai");
  const req_id = decoded.noteID;
  const note = NoteModel.findOne({ _id: noteID });
  const userID_in_note = note.userID;

  try {
    if (req_id === userID_in_note) {
      await NoteModel.findByIdAndDelete({ _id: noteID });
      res.status(200).send({ msg: "Note has been deleted" });
    } else {
      res.status(400).send({ msg: "You are not authorised" });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

module.exports = { noteRouter };
