const express = require("express");
const path = require("path");
const { login, googleLoginCallback, passport } = require("../API-Controllers/auth.controller.js");

const router = express.Router();
router.post("/", login);

// api google
router.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login?error=oauth" }),
  googleLoginCallback
);

router.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../../Frontend", "login.html"))
})
module.exports = router;
