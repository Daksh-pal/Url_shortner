import mongoose from 'mongoose';
import z from 'zod';

const urlSchema = new mongoose.Schema({
    shortId:{
        type: String,
        required: true,
        unique:true,
        index : true
    },
    originalUrl : {
        type: String,
        required: true,
    },
    clicks: {
        type : Number,
        required : true,
        default : 0,
    },
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : null
    }
},{
    timestamps : true
})

export const Url = mongoose.model("Url" , urlSchema);