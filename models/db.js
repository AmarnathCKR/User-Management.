const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/UsersDB', 
    {useNewUrlParser : true},
    (err) => {
        if (!err) {
            console.log("Database Connected..!");
        }
        else{
            console.log("DB error: " + err);
        }
    }
);

require('./user.model');