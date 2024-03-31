const mongoose = require('mongoose')

const userSchema = new mongoose.Schema (

{
    surname: {
      type: String,
      required: [true, 'Please enter your surname']
    },
    firstname: {
      type: String,
      required: [true, 'Please enter your first name']
    },
    othername: {
      type: String
    },
    email: {
      type: String,
    //   unique: true,
    //   lowercase: true,
      required: [true, 'Please enter your email address'],
    //   validate: [isEmail, 'please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
    //   validate: [
    //     passwordValidator,
    //     'Password must contain at least one lowercase letter, one uppercase letter, one digit, one symbol (@#$%^&*!), and have a minimum length of 8 characters'
    //   ]
     },
    phoneNumber: {
      type: Number,
      required: [true, 'Please enter your phone number']
    },

}
)

const User = mongoose.model('userModel', userSchema)

module.exports = User