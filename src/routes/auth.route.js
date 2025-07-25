import express from 'express'
import {
    checkEmail,
    signup,
    login,
    logout,
    sso,
} from '../controllers/auth.controller.js'
import {
    validateCheckEmail,
    validateSignup,
    validateLogin,
    validateSSO,
} from '../validators/auth-validate.middleware.js'

const router = express.Router()

// Public routes (no authentication required)
router.post('/check-email', validateCheckEmail, checkEmail)
router.post('/signup', validateSignup, signup)
router.post('/login', validateLogin, login)
router.post('/logout', logout)

router.post('/sso', validateSSO, sso)

export default router
