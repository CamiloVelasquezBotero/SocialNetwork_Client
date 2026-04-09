import { z } from 'zod'

export const userRegisterSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'The name is obligatory'),
  email: z.string()
    .trim()
    .min(1, 'The Email is obligatory')
    .email('Invalid email format'),
  password: z.string()
    .trim()
    .min(5, 'Minimum 5 characters for the password'),
})

export const userLoginSchema = userRegisterSchema.pick({
  email: true
}).extend({
  password: z.string()
  .trim()
  .min(1, 'The password cannot be empty')
})

const friendSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
})

export const userDataSchema = userRegisterSchema.pick({
  email: true,
  name: true
}).extend({
  id: z.number(),
  friends: z.array(friendSchema),
  requestsSent: z.array(friendSchema),
  requestsReceived: z.array(friendSchema),
})

export const usersFoundInSearch = z.array(userDataSchema.pick({ id:true, email:true, name:true }))
export const UserInfo = userDataSchema.pick({ id:true, email:true, name:true })

export const userIdSchema = z.number()

export const dataSendRequest = z.object({
  userId: z.number(),
  currentUserid: z.number(),
})

export const acceptRequestSchema = z.object({
  message: z.string(),
  user: z.object({
    friends: z.array(friendSchema),
    requestsReceived: z.array(friendSchema)
  })
})

export const rejectRequestSchema = z.object({
  message: z.string(),
  user: z.object({
    requestsReceived: z.array(friendSchema)
  })
})

export const removeFriendSchema = z.object({
  message: z.string(),
  user: z.object({
    friends: z.array(friendSchema),
  })
})

export const usersSchema = z.object({
  userA: z.number(),
  userB: z.number()
})

export const messageSchema = z.object({
  id: z.number(),
  content: z.string(),
  senderId: z.number(),
  createdAt: z.coerce.date(),
  sender: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
  })
});


export const chatSchema = z.object({
  createdAt: z.date(),
  id: z.number(),
  messages: z.array(messageSchema),
  users: z.array(z.object({
    id: z.number(),
    chatId: z.number(),
    user: z.object({
      id: z.number(),
      email: z.string(),
      name: z.string(),
    })
  }))
})