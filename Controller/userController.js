const mongodb = require("mongodb");
const db = require("../db");
const fileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const e = require("express");

const nodemailer = require("nodemailer");

const sendEmail = (otp, email) => {
  const h1 = "<h2>OTP for reset password</h2><hr>";
  const h2 = h1 + "<h3>OTP: " + otp + "</h3>";

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "project2020sliit@gmail.com",
      pass: "sliit2020",
    },
  });

  var mailOptions = {
    from: "project2020sliit@gmail.com",
    to: email,
    subject: "OTP",
    html: h2,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      // return false
    } else {
      console.log("Email sent: " + info.response);
      // return true
    }
  });
};

exports.login = (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .findOne({
      email: req.body.email,
      password: req.body.password,
    })
    .then((resp) => {
      console.log(resp)
      if (resp) {
        const token = jwt.sign(
          { userID: resp._id, email: resp.email },
          "lmsuservalidation",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          auth: true,
          ...resp,
          token: token,
          tokenExpiration: 1,
        });
      } else {
        res.status(400).json({ auth: false });
      }
    })
    .catch(() => {
      res.status(400).json({ auth: false });
    });
};

exports.CheckMail = (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .findOne({ email: req.query.email })
    .then((resp) => {
      if (resp) {
        const userID = resp._id;

        const OTP = Math.floor(Math.random() * 89999) + 10000;
        db.getDb()
          .db()
          .collection("OTP")
          .insertOne({ userID, email: req.query.email, OTP: OTP })
          .then((resp) => {
            sendEmail(OTP, req.query.email);

            res.status(200).json({ available: true, userID });
          });
      } else {
        res.status(200).json({ available: false });
      }
    })
    .catch((er) => {
      console.log(er);
    });
};

exports.checkOTP = (req, res, next) => {
  console.log(req.body.otp, req.body.email);
  db.getDb()
    .db()
    .collection("User")
    .findOne({ email: req.body.email, otp: parseInt(req.body.otp) })
    .then((resp) => {
      if (resp) {
        res
          .status(200)
          .json({ valid: true, ...resp, auth: true, token: "", password: "" });
      } else {
        res.status(400).json({ valid: false });
      }
    })
    .catch(() => {
      res.status(400).json({ valid: false });
    });
};

exports.FindUser = (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .findOne({
      _id: new mongodb.ObjectId(req.body._id),
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json(resp);
      } else {
        res.status(200).json({ auth: false });
      }
    })
    .catch(() => {});
};

exports.GetUser = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.ID.length !== 24) {
    res.status(200).json({ fetch: false });
    return;
  }
  db.getDb()
    .db()
    .collection("User")
    .findOne({
      _id: new mongodb.ObjectId(req.query.ID),
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json(resp);
      } else {
        res.status(200).json({ fetch: false });
      }
    })
    .catch(() => {
      res.status(200).json({ fetch: false });
    });
};

exports.EditUser = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body._id.length !== 24) {
    res.status(200).json({ ack: false });
    return;
  }

  db.getDb()
    .db()
    .collection("User")
    .updateOne(
      {
        _id: new mongodb.ObjectId(req.body._id),
      },
      {
        $set: {
          name: req.body.name,
          address: req.body.address,
          contact: req.body.contact,
          password: req.body.password,
          bio: req.body.bio,
        },
      }
    )
    .then((resp) => {
      if (resp.modifiedCount === 1) {
        res.status(200).json({ ack: true });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ ack: false, msg: er });
    });
};

exports.AddDP = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body._id.length !== 24) {
    res.status(200).json({ ack: false });
    return;
  }

  let poster = req.files.dp;
  const fileName = req.body._id + poster.name;

  if (
    !poster.mimetype.includes("image/jpeg") ||
    !(poster.size / (1024 * 1024) < 5)
  ) {
    res.status(200).json({ file: false });
    return;
  }

  poster.mv("Dp/" + fileName, (error) => {
    if (error) {
      res.status(200).json({ ack: false });
    } else {
      const dp = "http://localhost:5000/Dp/" + fileName;

      db.getDb()
        .db()
        .collection("User")
        .updateOne(
          { _id: new mongodb.ObjectId(req.body._id) },
          {
            $set: {
              dp: dp,
            },
          }
        )
        .then((resp) => {
          if (resp.modifiedCount === 1) {
            res.status(200).json({ ack: true });
          } else {
            res.status(200).json({ ack: false });
          }
        })
        .catch(() => {
          res.status(200).json({ ack: false });
        });
    }
  });
};

exports.GetDP = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.ID.length !== 24) {
    res.status(200).json({ available: false });
    return;
  }
  db.getDb()
    .db()
    .collection("User")
    .findOne({
      _id: new mongodb.ObjectId(req.query.ID),
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json({ dp: resp.dp, name: resp.name });
      } else {
        res.status(200).json({ available: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ available: false, msg: er });
    });
};

exports.DeleteUser = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.query.ID.length !== 24) {
    res.status(200).json({ ack: false });
    return;
  }
  db.getDb()
    .db()
    .collection("User")
    .deleteOne({
      _id: new mongodb.ObjectId(req.query.ID),
    })
    .then((resp) => {
      if (resp.deletedCount === 1) {
        res.status(200).json({ ack: true });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ ack: false, msg: er });
    });
};

exports.GetModules = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Enroll")
    .find(
      {
        students: req.query.ID,
      },
      { students: -1 }
    )
    .toArray()
    .then((resp) => {
      if (resp) {
        res.status(200).json({ courses: resp });
      } else {
        res.status(200).json({ available: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ msg: er });
    });
};

exports.Unenroll = (req, res, next) => {
  if (req.auth === false) {
    res.status(200).json({ auth: false });
    return;
  }
  if (req.body.ID.length !== 24) {
    res.status(200).json({ ack: false });
    return;
  }
  db.getDb()
    .db()
    .collection("Enroll")
    .updateOne(
      {
        _id: new mongodb.ObjectId(req.body.ID),
      },

      { $pull: { students: req.body.student } }
    )
    .then((resp) => {
      if (resp.modifiedCount === 1) {
        res.status(200).json({ ack: true });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch(() => {
      res.status(200).json({ ack: false });
    });
};

exports.resetPass = (req, res, next) => {
  db.getDb()
    .db()
    .collection("User")
    .updateOne(
      {
        email: req.body.email,
      },
      { $set: { password: req.body.password } }
    )
    .then((resp) => {
      if (resp.modifiedCount === 1) {
        res
          .status(200)
          .json({
            ack: true,
            auth: true,
            token: "",
            email: req.body.email,
            password: "",
          });
      } else {
        res.status(400).json({ ack: false });
      }
    })
    .catch((er) => {
      res.status(400).json({ ack: false });
    });
};

exports.CheckValidity = (req, res, next) => {
  if (req.query.userID.length !== 24) {
    res.status(200).json({ ack: false });
    return;
  }
  db.getDb()
    .db()
    .collection("OTP")
    .findOne({
      userID: new mongodb.ObjectId(req.query.userID),
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json({ ack: true });
      } else {
        res.status(200).json({ ack: false });
      }
    })
    .catch((er) => {
      res.status(200).json({ ack: false });
    });
};

exports.register = (req, res, next) => {
  console.log(req.body);
  db.getDb()
    .db()
    .collection("User")
    .findOne({
      email: req.body.email,
    })
    .then((resp) => {
      if (resp) {
        res.status(200).json({ ack: false });
      } else {
        db.getDb()
          .db()
          .collection("User")
          .insertOne({
            ...req.body,
          })
          .then((res1) => {
            res.status(200).json({ ack: true });
          })
          .catch((er) => {
            res.status(200).json({ ack: false });
          });
      }
    })
    .catch((er) => {
      res.status(200).json({ ack: false });
    });
};

exports.sendOTP = (req, res, next) => {
  console.log(req.body.email);
  db.getDb()
    .db()
    .collection("User")
    .findOne({
      email: req.body.email,
    })
    .then((resp) => {
      if (resp) {
        const otp = Math.ceil(Math.random() * 1000);
        db.getDb()
          .db()
          .collection("User")
          .updateOne({ email: req.body.email }, { $set: { otp: otp } })
          .then(() => {
            // sendEmail(otp, req.body.email);
            res.status(200).json({ ack: true, ...resp, auth: true, token: "" });
          })
          .catch(() => {
            res.status(400).json({ ack: false });
          });
      } else {
        res.status(400).json({ ack: false });
      }
    })
    .catch((er) => {
      res.status(400).json({ ack: false });
    });
};
