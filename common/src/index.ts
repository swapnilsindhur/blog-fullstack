import {z} from "zod"

export const signupBody = z.object({
    username:z.string().email(),
    password:z.string(),
    name:z.string().optional()
})

export const signinBody = z.object({
    username:z.string().email(),
    password:z.string()
})

export const blogPost = z.object({
    title:z.string(),
    content:z.string()
})

export const blogPut = z.object({
    id:z.number(),
    title:z.string(),
    content:z.string()
})

export type signupParams = z.infer<typeof signupBody>
export type signinParams = z.infer<typeof signinBody>
export type blogPostParams = z.infer<typeof blogPost>
export type blogPutParams = z.infer<typeof blogPut>

