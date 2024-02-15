import mongoose, { Mongoose } from "mongoose";

const postSchema = new mongoose.Schema(
    {
        author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        },
        title: {
        type: String,
        required: true,
        unique: true,
        },
        content: {
        type: String,
        required: true,
        },
        image:{
        type: String,
        default: "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
        },

        category:{
        type: String,
        required: true,
        },
        slug: {
        type: String,
        required: true,
        unique: true,
        },

    },
    {
        timestamps: true,
    }
    ); 

const Post = mongoose.model("Post", postSchema);

export default Post;