const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
        username:{
            type:String,
            unique:[true ,"Username already exists"],
            reuired: true,
        },
        email:{
            type:String,
            unique:[true ,"Account already exists with same email"],
            reuired:true,
        },
        password:{
            type:String,
            required:true,
        },

})
const userModel=mongoose.model("users",userSchema);
module.exports=userModel;