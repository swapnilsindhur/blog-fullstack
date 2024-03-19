import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {verify } from 'hono/jwt'
import { blogPost, blogPut } from "@swapnilsindhur/medium-common";

export const blogRoutes = new Hono<{
    Bindings:{
      DATABASE_URL:string;
      JWT_PASSWORD:string;
    },Variables:{
        userId:string
    }
}>()

//middleware-> Authorization.
blogRoutes.use(async(c,next)=>{
    const token = c.req.header("authorization")||"";
    const user = await verify(token,c.env.JWT_PASSWORD);
    if(user){
        c.set("userId",user.id);
        ;await next();
    }else{
        c.status(403);
        return c.text("User authorization failed!")
    }
})


// user posting new blog
blogRoutes.post('/', async (c) => {
    try{const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const userId = Number(c.get("userId"));
    const body = await c.req.json();
    //zod
    const {success} = blogPost.safeParse(body);
      if(!success) {
        c.status(403)
        return c.text("Invalid input!")
      }


    const post = await prisma.blog.create({
        data:{
            title:body.title,
            content:body.content,
            authId:userId
        }
    })

    c.status(200);
    return c.json({
        id:post.id,
        message:"Blog posted!"
    })}
    catch(err) {
        c.status(411)
        return c.text("Something went wrong in blogs 1!")
    }
})
  



// user updating blog
blogRoutes.put('/', async (c) => {
    try{const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const userId = Number(c.get("userId"));
    const body = await c.req.json();
    //zod
    const {success} = blogPut.safeParse(body);
    if(!success) {
      c.status(403)
      return c.text("Invalid input!")
    }

    const post = await prisma.blog.update({
        where:{
            id:body.id,
            authId:userId
        },data:{
            title:body.title,
            content:body.content
        }
    })

    c.status(200);
    return c.text("Blog updated!")
}
    catch(err) {
        c.status(411)
        return c.text("Something went wrong in blogs 2!")
    }
})
  




// getting all blogs
// ideally we do pagination ***
blogRoutes.get('/bulk',async (c) => {
    try{const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const posts = await prisma.blog.findMany({});

    return c.json(posts);}
    catch(err) {
        c.status(411);
        console.log(err);
        
        return c.text("Something went wrong in blogs 4!")
    }

})


// getting blog by id
blogRoutes.get('/:id',async (c) => {
    try{
    const id = Number(c.req.param('id'));
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const post = await prisma.blog.findUnique({
        where:{
            id
        }
    })
    c.status(200);
    return c.json(post)}
    catch(err) {
        c.status(411);
        console.log(err);
        
        return c.text("Something went wrong in blogs 3!")
    }
})
  
