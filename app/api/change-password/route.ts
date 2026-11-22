'use server'
import { prisma } from '@/src/prisma-connection/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// PATCH - Change password
export async function PATCH(req: Request) {
    const bearer = req.headers.get('authorization')
    if (!bearer || !bearer.startsWith('Bearer')) {
        return Response.json({ error: 'Invalid Token' }, { status: 401 })
    }

    const token = bearer.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY!)
        if (typeof decoded !== 'object' || !decoded.id) {
            return Response.json({ error: 'Invalid Token' }, { status: 401 })
        }
        const userId = Number(decoded.id)

        const body = await req.json()
        const { currentPassword, newPassword } = body

        if (!currentPassword || !newPassword) {
            return Response.json({ error: 'Current and new password are required' }, { status: 400 })
        }

        if (newPassword.length < 5) {
            return Response.json({ error: 'New password must be at least 5 characters' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 })
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password)
        if (!passwordMatch) {
            return Response.json({ error: 'Current password is incorrect' }, { status: 400 })
        }

        const newPasswordHashed = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
            where: { id: userId },
            data: { password: newPasswordHashed }
        })

        return Response.json({ message: 'Password updated successfully' }, { status: 200 })
    } catch (error) {
        console.log('Error changing password:', error)
        return Response.json({ error: 'Error changing password' }, { status: 500 })
    }
}
