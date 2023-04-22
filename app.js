const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const multer = require("multer");
// const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
const Apiary = require("./models/apiaryModel");
const Hive = require("./models/hiveModel");
const Breed = require("./models/breedModel");
const HiveType = require("./models/hiveTypeModel");
const auth = require("./auth");
const cors = require("cors");

app.use(express.json({ limit: "52428800" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.post("/register", (request, response) => {
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });
      user
        .save()
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

app.post("/login", (request, response) => {
  User.findOne({ email: request.body.email })
    .then((user) => {
      bcrypt
        .compare(request.body.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

app.get("/getApiarys/:slug", (req, res) => {
  const slugTemp = req.params.slug;
  Apiary.find({ user: slugTemp }, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.send(result);
      res.status(200);
    }
  });
});

app.get("/getHives/:slug/:user", (req, res) => {
  const slugTemp = req.params.slug;
  const userTemp = req.params.user;
  Hive.find({ apiary: slugTemp, user: userTemp }, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.send(result);
      res.status(200);
    }
  });
});

app.get("/getHive/:apiary/:slug/:user", (req, res) => {
  const slugTemp = req.params.slug;
  const userTemp = req.params.user;
  const apiaryTemp = req.params.apiary;
  Hive.findOne(
    { apiary: apiaryTemp, user: userTemp, slug: slugTemp },
    (err, result) => {
      if (err) {
        res.status(500);
      } else {
        res.send(result);
        res.status(200);
      }
    }
  );
});

app.get("/getHiveTypes", (req, res) => {
  HiveType.find({}, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.send(result);
      res.status(200);
    }
  });
});

app.get("/getBreeds", (req, res) => {
  Breed.find({}, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.send(result);
      res.status(200);
    }
  });
});

app.post("/createApiary", async (req, res) => {
  try {
    const newApiary = new Apiary(req.body);
    const insertApiary = await newApiary.save();
    return res.status(200).json(insertApiary);
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
});

app.post("/createHive", async (req, res) => {
  try {
    const newHive = new Hive(req.body);
    const insertHive = await newHive.save();
    return res.status(200).json(insertHive);
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
});

app.route("/updateHive/:id").put((req, res, next) => {
  Hive.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error);
        console.log(error);
      } else {
        res.json(data);
        console.log("Hive updated successfully !");
      }
    }
  );
});

app.route("/deleteApiary/:id").delete((req, res, next) => {
  Apiary.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

app.route("/deleteHive/:id").delete((req, res, next) => {
  Hive.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

// app.route("/createApiary").post(upload.single("photo"), (req, res) => {
//   const title = req.body.title;
//   const slug = req.body.slug;
//   const user = req.body.user;
//   const photo = req.file.filename;

//   const newApiary = {
//     title,
//     slug,
//     user,
//     photo,
//   };

//   const newApiaryUpload = new Apiary(newApiary);

//   newApiaryUpload
//     .save()
//     .then(() => res.json("Apiary Added"))
//     .catch((err) => res.status(400).json("Error: " + err));
// });

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

module.exports = app;
