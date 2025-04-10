import mongoose from "mongoose";

const vedioSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        desc: {
           type: String,
           required: true
        },
        thumbnail:{
            type: String,
        },
        vedioFile:{
            type: String,
            required: true
        },
        duration: {
            type: String
        },
        views:{
            type: Number,
            default: 0
        },
        isPublished:{
            type: Boolean,
            default: true
        }

    },{timestamps: true}
)

vedioSchema.plugin(aggregatePaginate);

const Vedio = mongoose.model("Vedio", vedioSchema)
export default Vedio