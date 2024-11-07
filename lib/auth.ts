
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { User } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET!
const encodedKey = new TextEncoder().encode(JWT_SECRET)

export async function verifyAuth(token: string) {
    try {
        const { payload } = await jwtVerify(token, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.log('Failed to verify session')
    }
}

export async function createJWTToken(payload: User) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24hrs')
        .sign(encodedKey)
}


export async function hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}

export async function comparePassword(password: string, hashed: string) {
    const isValid = await bcrypt.compare(password, hashed)
    return isValid
}