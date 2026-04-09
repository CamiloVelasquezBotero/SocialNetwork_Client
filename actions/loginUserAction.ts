'use server'
import { prisma } from "@/src/prisma-connection/prisma";
import { userLoginSchema } from "@/src/schema-zod";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function loginUser(data: unknown) { // TODO: VERIFICAR EL TIPADO POR QUE AQUI DEBE IR FormData como type, pasarle los valores por el name del from
    const result = userLoginSchema.safeParse(data)
    if (!result.success) {
        return { errors: result.error.issues }
    }

    try {
        // Check if user Exists
        const userExists = await prisma.user.findFirst({
            where: {
                email: result.data.email
            }
        })
        if(!userExists) {
            return {errors: [{message: 'This Email is not registered'}]}
        }

        // Check password
        const passwordMatch = await bcrypt.compare(result.data.password, userExists.password)
        if(!passwordMatch) {
            return {errors: [{message: 'The password is incorrect'}]}
        }

        // Create JWT to save the user
        const token = jwt.sign(
            {
                id:userExists.id, name:userExists.name, email:userExists.email
            }, 
            process.env.SECRET_KEY!, 
            {expiresIn: '30d'}
        )
        // Datos de usuario
        const dataUser = {
            name: userExists.name,
            email: userExists.email
        }

        // Return the user
        return {token, dataUser}
    } catch (error) {
        console.log('There was an error when try to log in', error)
        return {error: 'There was an error when try to log in'}
    }
}