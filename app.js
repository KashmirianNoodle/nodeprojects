const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const app = express();
const ejs = require("ejs");
const encrypt = require("mongoose-encryption")

app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const secret = "thisisakeytoencryptourdatabase"
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
})
app.get("/login", function (req, res) {
    res.render("login");
})
app.get("/register", function (req, res) {
    res.render("register");
})
// app.get("/secrets", function (req, res) {
//     res.render("secrets");
// })
// app.get("/submit", function (req, res) {
//     res.render("submit");
// })

app.post("/register", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({
        username: username,
        password: password
    })
    newUser.save();
    res.render("secrets");

});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username: username }, function (err, foundUser) {
        if (!err) {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets")
                } else {
                    res.send("please enter the correct passoword");
                }
            } else {
                res.send("no such user");
            }
        } else {
            res.send("something went wrong");
        }
    })
})

app.listen(3000, function () {
    console.log("server started on port 3000")
})