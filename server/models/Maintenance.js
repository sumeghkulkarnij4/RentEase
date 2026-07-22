const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({

    orderId:String,

    userId:String,

    productName:String,

    issue:String,

    description:{
        type:String,
        default:"",
    },

    image:{
        type:String,
        default:"",
    },

    status:{
        type:String,
        default:"Pending",
    },

    assignedTo:{
        type:String,
        default:"",
    },

    createdAt:{
        type:Date,
        default:Date.now,
    }

});

module.exports = mongoose.model("Maintenance",maintenanceSchema);