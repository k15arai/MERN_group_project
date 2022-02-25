const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(()=>{
        console.log(`You are connected to the database called ${process.env.DB_NAME}`)
    })
    .catch((err)=>{
        console.log(`There is a problem connecting to ${process.env.DB_NAME}. Here is the error:`, err)
    })