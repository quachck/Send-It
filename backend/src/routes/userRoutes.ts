import { Router } from 'express'
import * as userController from '../controllers/userController'

const router = Router()

// Get all users
router.get('/', userController.getAllUsers)

// Add a new user
router.post('/', userController.addUser)

// Remove a user (set offline)
router.delete('/:username', userController.removeUser)

// Check if user exists
router.get('/exists/:username', userController.userExists)

export default router 