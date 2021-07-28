// Importing the modules
const mongoose = require('mongoose');

// Conneting with Database
mongoose.connect(`mongodb://${process.env.SERVER_NAME}:27017/${process.env.DATABASE_NAME}`,
    {
        useNewUrlParser: true,     // new url parser
        useUnifiedTopology: true,  // server discover and monitoring engine
        useFindAndModify: false,   // to use findByIdAndUpdate() method
        useCreateIndex: true       // to use index
    }).then(() => console.log('Connection Successful'))
    .catch(err => console.log(err));
