const mongodb = require("mongodb");
const db = require("../db");
const jwt = require("jsonwebtoken");
const e = require("express");

exports.addStudent = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Student")
    .insertOne({
      ...req.body,
    })
    .then((resp) => {
      res.status(200).json({ ...resp });
    })
    .catch((er) => {
      console.log(er);
      res.status(400).json({ ack: false });
    });
};

exports.getStudent = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Student")
    .findOne({
      _id: new mongodb.ObjectId(req.query._id),
    })
    .then((resp) => {
      res.status(200).json({ ...resp });
    })
    .catch(() => {
      res.status(400).json({ ack: false });
    });
};

exports.getStudents = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Student")
    .find()
    .toArray()
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch(() => {
      res.status(400).json({ ack: false });
    });
};
exports.getStudentsByName = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Student")
    .find({ firstName: { $regex: "^" + req.query.name, $options: "i" } })
    .toArray()
    .then((resp) => {
      // console.log(resp);
      res.status(200).json(resp);
    })
    .catch(() => {
      res.status(400).json({ ack: false });
    });
};
exports.deleteStudent = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Student")
    .deleteOne({ _id: new mongodb.ObjectId(req.query._id) })
    .then((resp) => {
      res.status(200).json({ ack: true });
    })
    .catch(() => {
      res.status(400).json({ ack: false });
    });
};

exports.updateStudent = (req, res, next) => {
  console.log(req.body);
  db.getDb()
    .db()
    .collection("Student")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          contactNumber: req.body.contactNumber,
          idNumber: req.body.idNumber,
          facultyId: req.body.facultyId,
          degreeId: req.body.degreeId,
          role: req.body.role,
          academicYear: req.body.academicYear,
        },
      }
    )
    .then((resp) => {
      res.status(200).json({ ...resp });
    })
    .catch(() => {
      console.log(er);
      res.status(400).json({ ack: false });
    });
};
