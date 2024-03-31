const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/model')

const registerUser = async (req, res) => {
    try {
      const { surname, firstname, othername, email, password, phoneNumber } =
        req.body
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: 'Email already exists.' })
      }
    //   if (!passwordValidator(password)) {
    //     return res.status(400).json({
    //       success: false,
    //       message:
    //         'Password must contain at least one lowercase letter, one uppercase letter, one digit, one symbol (@#$%^&*!), and have a minimum length of 8 characters'
    //     })
    //   }
      const hashPassword = await bcrypt.hash(password, 10)
    //   const generateId = generateUserId()
      const newUser = User({
        surname,
        firstname,
        othername,
        email,
        password: hashPassword,
        phoneNumber,
        // userId: generateId
      })
  
      const savedUser = await newUser.save()

      res
        .status(201)
        .json({ success: true, message: 'User Created Successfully', savedUser })
    } catch (error) {
    //   handleErrors(error, res)
      res.status(500).json({ success: false, message: error.message })
    }
  }

  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body
      const existingUser = await User.findOne({ email })
      if (!existingUser) {
        return res
       .status(400)
       .json({ success: false, message: 'Email does not exist.' })
      }
      const validPassword = await bcrypt.compare(password, existingUser.password)
      if (!validPassword) {
        return res
       .status(400)
       .json({ success: false, message: 'Password is incorrect.' })
      }
      const token = jwt.sign({ _id: existingUser._id }, process.env.SECRET)
      res
     .status(200)
     .json({ success: true, message: 'User Logged In Successfully', token })
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
   }



  }

  module.exports = {registerUser, loginUser } 