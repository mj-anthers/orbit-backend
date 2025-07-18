import jwt from 'jsonwebtoken'
import crypto from 'crypto'

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {string} secret - JWT secret
 * @param {string} expiresIn - Token expiration
 * @returns {string} JWT token
 */
export const generateToken = (payload, secret, expiresIn = '1h') => {
    return jwt.sign(payload, secret, { expiresIn })
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret)
}

/**
 * Generate secure random token
 * @param {number} length - Token length in bytes
 * @returns {string} Random token
 */
export const generateSecureToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex')
}
