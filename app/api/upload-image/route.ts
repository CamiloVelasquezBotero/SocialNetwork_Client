'use server'
import { prisma } from '@/src/prisma-connection/prisma'
import jwt from 'jsonwebtoken'

// POST - Upload profile picture (converts to Base64 and saves in DB for full Vercel serverless support)
export async function POST(req: Request) {
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

        const formData = await req.formData()
        const file = formData.get('image') as File

        if (!file) {
            return Response.json({ error: 'No file found' }, { status: 400 })
        }

        if (!file.type.startsWith('image/')) {
            return Response.json({ error: 'Only images are allowed' }, { status: 400 })
        }

        if (file.size > 4 * 1024 * 1024) {
            return Response.json({ error: 'Image cannot exceed 4MB' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`

        await prisma.user.update({
            where: { id: userId },
            data: { profileImage: base64Image }
        })

        return Response.json({ profileImage: base64Image }, { status: 200 })
    } catch (error) {
        console.log('Error uploading image:', error)
        return Response.json({ error: 'Error uploading image' }, { status: 500 })
    }
}
