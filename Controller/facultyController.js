const mongodb = require("mongodb");

const db = require("../db");
// get request
exports.getFaculty = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }

  db.getDb()
    .db()
    .collection("Faculty")
    .findOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ fetch: false });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch((er) => {
      console.log(er);
    });
};
// get request
exports.getFaculties = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Faculty")
    .find()
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ error: true });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      console.log("error");
      res.status(200).json({ error: "can not get faculty from database" });
    });
};
// add Faculty get request
exports.addFaculty = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Faculty")
    .insertOne(req.body)
    .then((resp) => {
      if (resp.insertedId) {
        res.status(200).json({ insert: true });
      } else {
        res.status(200).json({ insert: false });
      }
    })
    .catch((er) => {
      console.log(er);
    });
};
//
// post request
exports.updateFaculty = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Faculty")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          facultyName: req.body.facultyName,
          codeNumber: req.body.codeNumber,
          HOD: req.body.HOD,
        },
      }
    )

    .then((resp) => {
      if (resp.modifiedCount === 1) {
        res.status(200).json({ ack: true });
      } else {
        res.status(400).json({ ack: false });
      }
    })
    .catch(() => {
      res.status(400).json({ ack: false });
      console.log("error");
    });
};
//delete request
exports.deleteFaculty = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Faculty")
    .deleteOne({ _id: new mongodb.ObjectId(req.query._id) })
    .then((resp) => {
      if (resp.deletedCount === 1) {
        res.status(200).json({ ack: true });
      } else {
        res.status(400).json({ ack: false });
      }
    })
    .catch((er) => {
      res.status(400).json({ ack: false });
      console.log(er);
    });
};

//post request
exports.GetCourse = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body.courses) {
    //   const arr = req.body.courses.split(",");
    const contentID = req.body.courses.map((row) => {
      return mongodb.ObjectId(row);
    });

    db.getDb()
      .db()
      .collection("course")
      .find({ _id: { $in: contentID } })
      .toArray()
      .then((resp) => {
        if (!resp) {
          res.status(200).json({ error: "no course at the moment" });
        } else {
          res.status(200).json(resp);
        }
      })
      .catch((er) => {
        console.log(er);
      });
  } else {
    res.status(200).json({ msg: "no Courses" });
  }
};
