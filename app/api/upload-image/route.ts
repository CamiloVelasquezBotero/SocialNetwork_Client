'use server'
import { prisma } from '@/src/prisma-connection/prisma'
import jwt from 'jsonwebtoken'
import { writeFile } from 'fs/promises'
import path from 'path'

// POST - Upload profile picture
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

        if (file.size > 5 * 1024 * 1024) {
            return Response.json({ error: 'Image cannot exceed 5MB' }, { status: 400 })
        }

        const extension = file.name.split('.').pop()
        const fileName = `profile_${userId}_${Date.now()}.${extension}`
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)

        const publicImageUrl = `/uploads/${fileName}`

        await prisma.user.update({
            where: { id: userId },
            data: { profileImage: publicImageUrl }
        })

        return Response.json({ profileImage: publicImageUrl }, { status: 200 })
    } catch (error) {
        console.log('Error uploading image:', error)
        return Response.json({ error: 'Error uploading image' }, { status: 500 })
    }
}
