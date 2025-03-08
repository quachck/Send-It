import { Router } from 'express'
import * as messageController from '../controllers/messageController'

const router = Router()

// Get messages for a user
router.get('/:username', messageController.getUserMessages)

// Send a new message
router.post('/', messageController.sendMessage)

export default router 