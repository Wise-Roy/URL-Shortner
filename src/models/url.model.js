import mongoose from "mongoose"

const urlSchema = new mongoose.Schema({
    originalURL: {
        type: String,
        required: true,
        trim: true,
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    clicks: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
      },
  
      expiresAt: {
        type: Date,
        default: null,
      },
},
{
    timestamps: true,
})

export const Url = mongoose.model("Url", urlSchema);