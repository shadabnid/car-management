import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({


    email: {
        type: String, 
        required: true, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    
    
})

export const User = mongoose.models.user || mongoose.model('user',userSchema)