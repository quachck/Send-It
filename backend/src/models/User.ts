import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  isOnline: {
    type: Boolean,
    default: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

export default mongoose.model('User', userSchema) 