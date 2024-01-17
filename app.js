//jshint esversion:6
require('dotenv').config();
const express = require("express")
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")
const Port = 3000
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
mongoose.connect("mongodb://localhost:27017/sec", { useNewUrlParser: true })

const secSchema = new mongoose.Schema({
    email: String,
    password: String
})
// mongoose Encryption

secSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const Sec = new mongoose.model("Sec", secSchema);

app.get("/", function (req, res) {
    res.render("home")
});
app.get("/login", function (req, res) {
    res.render("login")
});
app.get("/register", function (req, res) {
    res.render("register")
})

app.post("/register", function (req, res) {
    const { email, password } = req.body;
    const newSec = new Sec({
        email, password
    });
    newSec.save(function (er) {
        if (er) { throw er; }
        else {
            res.render("secrets")
        }
    })
})
app.post("/login", function (req, res) {
    const { username, password } = req.body;
    Sec.findOne({ email: username }, function (er, found) {
        if (er) {
            throw er;
        } else {
            if (found.password === password) {
                res.render("secrets")
            }
        }
    })
})

app.listen(process.env.Port || Port, () => {
    console.log(`server connected on http://localhost:${Port}`)
});