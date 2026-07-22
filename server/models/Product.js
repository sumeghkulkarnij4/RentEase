const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
    },

    category:{
        type:String,
        required:true,
    },

    rent:{
        type:Number,
        required:true,
    },

    deposit:{
        type:Number,
        required:true,
    },

    tenureOptions:{
        type:[Number],
        default:[3,6,12],
    },

    description:{
        type:String,
        default:"",
    },

    image:{
        type:String,
    },

    stock:{
        type:Number,
        default:10,
    },

    available:{
        type:Boolean,
        default:true,
    },

    rating:{
        type:Number,
        default:0,
    },

    totalReviews:{
        type:Number,
        default:0,
    }
},
{
    timestamps:true,
});

module.exports = mongoose.model("Product",productSchema);