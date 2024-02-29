const express = require ("express");
const router = express.Router();

const User = require("../models/User");

const passport = require("passport");

router.get("/users/signin", (req, res) => {
    res.render("users/signin");
});

router.post("/users/signin", passport.authenticate("local", {
    successRedirect: "/posts",
    failureMessage: "/users/signin"
}))

router.get("/users/signup", (req, res) => {
    res.render("users/signup");
});


router.post("/users/signup", async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if (password != confirm_password){
        errors.push({text: "Las contraseñas no coinciden"});
    }
    if (password.length < 4) {
        errors.push({text: "La contraseña debe tener más de 4 caracteres"});
    }
    if (errors.lenght > 0) {
        res.render("users/signup", {errors, name, email, password, confirm_password});
    } else {
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        res.redirect("/users/signin");
    }
});

router.get("/users/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/");
    });
  });
 
module.exports = router;
