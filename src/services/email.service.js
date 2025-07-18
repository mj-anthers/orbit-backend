/**
 * @fileoverview Email service for sending various types of emails.
 * Handles verification emails, password reset emails, and welcome emails.
 */
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { consoleLog } from '../utils/index.js'

dotenv.config()

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

// Base URL for frontend
const FRONTEND_URL = process.env.FRONTEND_URL

/**
 * Send an email using the configured transporter
 * @param {Object} options - Email options (to, subject, html)
 * @returns {Promise} - Resolves when email is sent
 */
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
            ...options,
        }
        await transporter.sendMail(mailOptions)
        consoleLog(`[EMAIL SERVICE] Email sent successfully to ${options.to}`)
    } catch (error) {
        consoleLog('[EMAIL SERVICE] Error sending email:', error)
        throw error
    }
}

/**
 * Send verification email to new user
 * @param {Object} user - User object
 * @param {string} token - Verification token
 */
export const sendVerificationEmail = async (user, token) => {
    const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`

    const html = `
        <h1>Welcome to ${process.env.APP_NAME}!</h1>
        <p>Hello ${user.firstName},</p>
        <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
        <p>
            <a href="${verificationUrl}" style="
                background-color: #4CAF50;
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 4px;">
                Verify Email Address
            </a>
        </p>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not create an account, no further action is required.</p>
        <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
    `

    await sendEmail({
        to: user.email,
        subject: `Welcome to ${process.env.APP_NAME} - Verify Your Email`,
        html,
    })
}

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} token - Reset token
 */
export const sendPasswordResetEmail = async (user, token) => {
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`

    const html = `
        <h1>Password Reset Request</h1>
        <p>Hello ${user.firstName},</p>
        <p>You are receiving this email because we received a password reset request for your account.</p>
        <p>Please click the button below to reset your password:</p>
        <p>
            <a href="${resetUrl}" style="
                background-color: #4CAF50;
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 4px;">
                Reset Password
            </a>
        </p>
        <p>Or copy and paste this link in your browser:</p>
        <p>${resetUrl}</p>
        <p>This password reset link will expire in 1 hour.</p>
        <p>If you did not request a password reset, no further action is required.</p>
        <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
    `

    await sendEmail({
        to: user.email,
        subject: `${process.env.APP_NAME} - Password Reset Request`,
        html,
    })
}

/**
 * Send welcome email after email verification
 * @param {Object} user - User object
 */
export const sendWelcomeEmail = async (user) => {
    const html = `
        <h1>Welcome to ${process.env.APP_NAME}!</h1>
        <p>Hello ${user.firstName},</p>
        <p>Thank you for verifying your email address. Your account is now fully activated!</p>
        <p>You can now access all features of ${process.env.APP_NAME}.</p>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
    `

    await sendEmail({
        to: user.email,
        subject: `Welcome to ${process.env.APP_NAME}!`,
        html,
    })
}

/**
 * Send magic link email for passwordless login
 * @param {Object} user - User object
 * @param {string} token - Magic link token
 */
export const sendMagicLinkEmail = async (user, token) => {
    const magicUrl = `${FRONTEND_URL}/auth/magic-link?token=${token}`

    const html = `
        <h1>Your Magic Link</h1>
        <p>Hello ${user.firstName},</p>
        <p>You requested a magic link to sign in to your account. Click the button below to sign in:</p>
        <p>
            <a href="${magicUrl}" style="
                background-color: #4CAF50;
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 4px;">
                Sign In with Magic Link
            </a>
        </p>
        <p>Or copy and paste this link in your browser:</p>
        <p>${magicUrl}</p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
    `

    await sendEmail({
        to: user.email,
        subject: `${process.env.APP_NAME} - Magic Link Sign In`,
        html,
    })
}
