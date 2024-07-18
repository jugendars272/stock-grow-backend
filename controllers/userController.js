const {User} = require("../models")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  
    // checking user already exists
    let userPhone = req.body.phone;
    let userEmail = req.body.email;

    let existingUser = await User.findOne({ email:userEmail });
    
    if (existingUser) {
      res.send({ error: true, msg: "Phone Number or Email already registered" });
      return;
    }
   
    // creating new user
    const newUser = new User();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    newUser.password = hashedPassword;
    newUser.phone = req.body.phone;
    newUser.email = req.body.email
    newUser.name = req.body.name
    // assigning jwt
    let phone = req.body.phone;
    let _id = newUser._id;
    let payload = { phone, _id };
    let token = jwt.sign(payload, JWT_SECRET);
    await newUser.save();
    res.send({ error: null, msg: "Yor account is registered", token });
  };

const login = async (req, res) => {
    // getting user details
    let userEmail = req.body.email;
    let userPass = req.body.password;
    let userFound = await User.findOne({ email: userEmail });
    if (!userFound) return res.send({ error: true, msg: "No User Found" });
  
    // authenticating user password
    let encryptedPass = userFound.password;
    let auth = await bcrypt.compare(userPass, encryptedPass);
    if (!auth) return res.send({ error: true, msg: "wrong Pass" });
  
    // assigning user jwt
    let phone = userFound.phone;
    let _id = userFound._id;
    let payload = { phone, _id };
    let token = jwt.sign(payload, JWT_SECRET);
    res.send({ error: null, msg: "Logged In", token });
  };

module.exports ={
    register,
    login
}

