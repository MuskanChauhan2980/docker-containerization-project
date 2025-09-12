const express = require("express");
const bodyParser = require("body-parser");
const { Customer } = require("../Database/db");
const router = express.Router();
const register = require("../controller.js/loansController");
const app = express();
app.use(bodyParser.json());


router.post("/register" , register);


module.exports=router;