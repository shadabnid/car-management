import mongoose, { Schema } from 'mongoose'


const productSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        // unique: true
    },
    description: {
        type: String,
        required: true
    },
    tags: [String],
    thumbnail_image: {
        type: String,
    },
    images: [String],
},
    {
        timestamps: true
    }
)

export const Product = mongoose.models.products || mongoose.model('products', productSchema);