import bcrypt from "bcrypt"
import {validationResult} from 'express-validator';
import jwt from "jsonwebtoken"
import User from "../models/userSchema.js"
const JWT_SECRET = 'Romanisagood$boy';


export const createUserController =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        fname: req.body.fname,
        Lname: req.body.Lname,
        Address: req.body.Address,
        PhoneNo: req.body.PhoneNo,
        email: req.body.email,
        password: secPass,
        City: req.body.City,
      });

      const data = { id: user.id };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.status(201).json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }

export const loginController =  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      console.log("Password Comparison:", passwordCompare); // Should print true if matching

      if (!passwordCompare) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const data = { id: user.id };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
}

export const getuserController =  async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user); // Return the user details without the password
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
}