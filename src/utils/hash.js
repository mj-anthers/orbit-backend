import bcrypt from 'bcrypt'
import { consoleLog } from './app-logger.js'
import crypto from 'crypto'

const SALT_ROUNDS = 10

/**
 * Hashes a plain text password.
 * @param {string} plainPassword - The raw password to hash
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (plainPassword) => {
    return bcrypt.hash(plainPassword, SALT_ROUNDS)
}

/**
 * Compares a plain text password with a hashed password.
 * @param {string} plainPassword - The password entered by the user
 * @param {string} hashedPassword - The hashed password stored in DB
 * @returns {Promise<boolean>} - true if match, false otherwise
 */
const comparePasswords = async (plainPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword)
    } catch (err) {
        consoleLog(err)
        return false
    }
}

const signUUID = (uuid) => {
    return crypto
        .createHmac('sha256', process.env.IDENTITY_TOKEN)
        .update(uuid, 'utf8')
        .digest('hex')
}

export { hashPassword, comparePasswords, signUUID }
