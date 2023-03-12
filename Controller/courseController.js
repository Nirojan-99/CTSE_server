const mongodb = require("mongodb");
const db = require("../db");

// get request
exports.getCourse = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.id.length !== 24) {
    res.status(200).json({ fetch: false });
    return;
  }
  db.getDb()
    .db()
    .collection("course")
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
exports.getCourses = (req, res, next) => {
  db.getDb()
    .db()
    .collection("course")
    .find()
    .toArray()
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
exports.getCoursesByFaculty = (req, res, next) => {
  console.log(req.query.faculty);
  db.getDb()
    .db()
    .collection("course")
    .find({ facultyId: req.query.faculty })
    .toArray()
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

// post request
//add course
exports.addCourse = (req, res, next) => {
  db.getDb()
    .db()
    .collection("course")
    .insertOne({ ...req.body })
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((er) => {
      console.log(er);
    });
};

// post request
// update course
exports.updateCourse = (req, res, next) => {
  console.log(req.body);
  db.getDb()
    .db()
    .collection("course")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          degree: req.body.degree,
          codeNumber: req.body.codeNumber,
          LIC: req.body.LIC,
          facultyId: req.body.facultyId,
          duration: req.body.duration,
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
      console.log(er);
    });
};

// delete request
// course  delete
exports.deleteCourse = (req, res, next) => {
  db.getDb()
    .db()
    .collection("course")
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
    });
};

// get request
// get year
exports.GetYear = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("course")
    .findOne({ _id: new mongodb.ObjectId(req.query.id) })
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ fetchYear: false });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch((er) => {
      console.log(er);
    });
};
//

// post request
// get Module
exports.getModule = (req, res, next) => {
  if (req.body.Modules) {
    const contentID = req.body.Modules.map((row) => {
      return mongodb.ObjectId(row);
    });

    db.getDb()
      .db()
      .collection("Module")
      .find({ _id: { $in: contentID } })
      .toArray()
      .then((resp) => {
        res.status(200).json(resp);
      })
      .catch((er) => {
        console.log(er);
      });
  } else {
    res.status(200).json({ msg: "no Module" });
  }
};
