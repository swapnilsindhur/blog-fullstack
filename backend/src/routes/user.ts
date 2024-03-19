import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign} from 'hono/jwt'
import { signinBody, signupBody } from '@swapnilsindhur/medium-common'

export const userRoutes = new Hono<{
    Bindings:{
      DATABASE_URL:string;
      JWT_PASSWORD:string;
    }
}>()


userRoutes.post('/signup', async (c) => {
    try{
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
  
      const body = await c.req.json();
      // zod 
      const {success} = signupBody.safeParse(body);
      if(!success) {
        c.status(403)
        return c.text("Invalid input!")
      }


      const user = await prisma.user.create({
        data:{
          name:body.name,
          username:body.username,
          password:body.password
        }
      })
  
      const auth = await sign({id:user.id},c.env.JWT_PASSWORD);
      c.status(200);
      return c.text(auth)
    }catch(err) {
      c.status(411);
      return c.text("Something went wrong!")
    }
  })
  
  
  
userRoutes.post('/signin',async (c) => {
    try{
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
  
      const body = await c.req.json();
      // zod 
      const {success} = signinBody.safeParse(body);
      if(!success) {
        c.status(403)
        return c.text("Invalid input!")
      }
      const user = await prisma.user.findFirst({
        where:{
          username:body.username,
          password:body.password
        }
      })
  
      if(!user) {
        c.status(403);
        return c.text("Invalid username or password!")
      }
  
      const auth = await sign({id:user.id},c.env.JWT_PASSWORD);
      c.status(200);
      return c.text(auth)
    }catch(err) {
      c.status(411);
      return c.text("Something went wrong!")
    }
})

