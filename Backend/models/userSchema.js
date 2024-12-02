import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
    fname:{
        type:String,
        required:true
    },
    Lname:{
        type:String,
        required:true
    },
    Address:{
        type:String,
        required:true
    },
    PhoneNo: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    City:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.Now
    }
});
const userSchema = mongoose.model('user',UserSchema);
// User.createIndexes();
export default userSchema;