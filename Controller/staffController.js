const mongodb = require("mongodb");
const db = require("../db");
const jwt = require("jsonwebtoken");
const e = require("express");

exports.addStaff = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Staff")
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

exports.getStaff = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Staff")
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

exports.getStaffs = (req, res, next) => {
  console.log("called");
  db.getDb()
    .db()
    .collection("Staff")
    .find()
    .toArray()
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch(() => {
      res.status(400).json({ ack: false });
    });
};
exports.getStaffHOD = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Staff")
    .find({
      role: "Professor",
    })
    .toArray()
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch(() => {
      res.status(400).json({ ack: false });
    });
};
exports.getStaffsByName = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Staff")
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
exports.deleteStaff = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Staff")
    .deleteOne({ _id: new mongodb.ObjectId(req.query._id) })
    .then((resp) => {
      res.status(200).json({ ack: true });
    })
    .catch(() => {
      res.status(400).json({ ack: false });
    });
};
exports.updateStaff = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Staff")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          contactNumber: req.body.contactNumber,
          division: req.body.division,
          faculty: req.body.faculty,
          role: req.body.role,
          sector: req.body.sector,
        },
      }
    )
    .then((resp) => {
      res.status(200).json({ ack: true });
    })
    .catch((er) => {
      console.log(er);
      res.status(400).json({ ack: false });
    });
};
