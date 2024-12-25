import z from "zod";

export const authLoginSchema = z.object({
    username: z.string().min(4).regex(/^\S*$/, "No spaces allowed"),
    password: z.string().min(8)
})

export const authRegisterESchema = z.object({
    username: z.string().min(4).regex(/^\S*$/, "No spaces allowed"),
    password: z.string().min(1),
    email: z.string().email(),
})


export type IAuthLogin = z.infer<typeof authLoginSchema>;
export type IAuthRegister = z.infer<typeof authRegisterESchema>;