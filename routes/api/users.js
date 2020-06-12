const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const becrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
//Load user Model
const User = require("../../models/Users");

// @route GET api/users/test
//desc tests users route
//access Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route GET api/users/register
//desc Register Yser
//access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exist" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm", //default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password,
      });

      becrypt.genSalt(10, (err, salt) => {
        becrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch(console.log(err));
        });
      });
    }
  });
});
// @route GET api/users/login
//desc User Login / Return Token
//access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "User Not Found" });
    }
    //check password

    becrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //user matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //create jwt payload
        //sign Token
        jwt.sign(payload, keys.secretORKey, { expiresIn: 3600 }, (err,token) => {
            res.json({
                success:true,
                token: 'Bearer '+token
            })
        });
      } else {
        return res.status(404).json({ password: "Password Incorrect" });
      }
    });
  });
});

module.exports = router;
