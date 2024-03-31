const mongoose = require('mongoose');

const ConnectToDB = () => {
  mongoose.connect(process.env.CONNECT_DB)

  .then(result =>{
    console.log('database connected')
  })
  .catch(err => console.log(err))


}
module.exports = ConnectToDB