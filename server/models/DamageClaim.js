const mongoose = require("mongoose");

const damageClaimSchema = new mongoose.Schema({

    orderId:{
        type:String,
        required:true,
    },

    userId:{
        type:String,
        required:true,
    },

    productName:{
        type:String,
        required:true,
    },

    damageDescription:{
        type:String,
        required:true,
    },

    estimatedAmount:{
        type:Number,
        default:0,
    },

    image:{
        type:String,
        default:"",
    },

    status:{
        type:String,
        default:"Pending",
    },

    createdAt:{
        type:Date,
        default:Date.now,
    }

});

module.exports = mongoose.model("DamageClaim",damageClaimSchema);