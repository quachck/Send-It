import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    trim: true
  },
  recipient: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    default: () => Date.now()
  }
}, {
  timestamps: true
})

export default mongoose.model('Message', messageSchema) 