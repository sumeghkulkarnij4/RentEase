const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    userId:{
        type:String,
        required:true,
    },

    address:{
        fullName:String,
        phone:String,
        street:String,
        city:String,
        state:String,
        pincode:String,
    },

    deliveryDate:String,

    rentalStartDate:String,

    rentalEndDate:String,

    status:{
        type:String,
        default:"Active",
    },

    orderStatus:{
        type:String,
        default:"Pending",
    },

    returnStatus:{
        type:String,
        default:"Not Returned",
    },

    deliveryPartner:{
        type:String,
        default:"",
    },

    pickupDate:{
        type:String,
        default:"",
    },

    pickupStatus:{
        type:String,
        default:"Pending",
    },

    paymentMethod:{
        type:String,
        default:"Cash on Delivery",
    },

    paymentStatus:{
        type:String,
        default:"Pending",
    },

    items:[
        {
            productId:String,
            name:String,
            rent:Number,
            image:String,
            quantity:Number,
            tenure:Number,
        },
    ],

    total:{
        type:Number,
        required:true,
    },

    createdAt:{
        type:Date,
        default:Date.now,
    }
    

});

module.exports = mongoose.model("Order",orderSchema);