const mongodb = require("mongodb");
const db = require("../db");

// get request
// get Module
exports.getModule = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Module")
    .findOne({
      _id: new mongodb.ObjectId(req.query.moduleID),
    })
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ moduledata: false });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      console.log("err");
      res.status(200).json({ error: "can not get Module from database" });
    });
};

//get request
//get modules
exports.getModules = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Module")
    .find()
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ modules: false });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      console.log("err");
      res.status(200).json({ error: "can not get Module from database" });
    });
};
exports.getModulesByName = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Module")
    .find({ moduleName: { $regex: "^" + req.query.name } })
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ modules: false });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      console.log("err");
      res.status(200).json({ error: "can not get Module from database" });
    });
};
// post request
// Add Module
exports.addModule = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Module")
    .insertOne(req.body)
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((er) => {
      res.status(400).json({ ack: false });
      console.log(er);
    });
};

// post request
// Update Module
exports.updateModule = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Module")
    .updateOne(
      { _id: new mongodb.ObjectId(req.body._id) },
      {
        $set: {
          moduleName: req.body.moduleName,
          moduleCode: req.body.moduleCode,
          LIC: req.body.LIC,
          enrolmentKey: req.body.enrolmentKey,
          duration: req.body.duration,
          courseId: req.body.courseId,
        },
      }
    )

    .then((resp) => {
      // res.status(200).json(resp);
      if (resp.modifiedCount === 1) {
        res.status(200).json({ uploaded: true });
      } else {
        res.status(400).json({ uploaded: false });
      }
    })
    .catch(() => {
      res.status(400).json({ uploaded: false });
      console.log("error");
    });
};

// delete request
// delete Module
exports.deleteModule = (req, res, next) => {
  db.getDb()
    .db()
    .collection("Module")
    .deleteOne({ _id: new mongodb.ObjectId(req.query._id) })
    .then((resp) => {
      if (resp.deletedCount === 1) {
        res.status(200).json({ deleted: true });
      } else {
        res.status(400).json({ deleted: false });
      }
    })
    .catch((er) => {
      res.status(400).json({ deleted: false });
      console.log(er);
    });
};

// get request
//get module details

exports.GetModuleDetails = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }

  db.getDb()
    .db()
    .collection("Module")
    .find({
      _id: new mongodb.ObjectId(req.query.moduleId),
    })
    .toArray()
    .then((resp) => {
      if (!resp) {
        res.status(200).json({ fetch: false });
      } else {
        res.status(200).json(resp);
      }
    })
    .catch(() => {
      console.log("err");
      res.status(200).json({ name: false });
      // res.status(200).json({ error: "can not get Module from database" });
    });
};
//get request
// get ModuleLectureIncharge and Modulename

exports.getLIC = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Module")
    .findOne({ _id: new mongodb.ObjectId(req.query.moduleID) })
    .then((resp) => {
      res
        .status(200)
        .json({ LIC: resp.ModuleLectureIncharge, name: resp.Modulename });
    })
    .catch((er) => {
      console.log(er);
    });
};

// post request
// enroll the course
exports.Enroll = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Module")
    .findOne({
      _id: new mongodb.ObjectId(req.body.moduleID),
      ModuleEnrollmentkey: req.body.key,
    })
    .then((resp) => {
      if (resp) {
        db.getDb()
          .db()
          .collection("Enroll")
          .updateOne(
            { id: req.body.moduleID, name: req.body.name },
            { $addToSet: { students: req.body.studentID } },
            { upsert: true }
          )
          .then((resp) => {
            if (resp.modifiedCount === 1 || resp.upsertedCount === 1) {
              res.status(200).json({ ack: true });
            } else {
              res.status(200).json({ ack: false });
            }
          })
          .catch((er) => {
            console.log(er);
            res.status(200).json({ ack: false });
          });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch((er) => {
      console.log(er);
    });
};
