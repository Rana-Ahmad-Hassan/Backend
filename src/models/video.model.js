import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
    Owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    video: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    thumbNail: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })


const Video = mongoose.model("Video", videoSchema)
export default Video;