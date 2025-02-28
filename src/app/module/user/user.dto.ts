import {Insertable, Selectable} from "kysely";
import {User} from "../../../db/db";
import {z} from "zod";
import {IPagination} from "../../../types/pagination";

export const userCreateDTO = z.object({
    username: z.string().min(4, "Username must be at least 4 characters").regex(/^\S*$/, "No spaces allowed"),
    name: z.string().nonempty("Fullname is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    email: z.string().email("Invalid email address"),
    roleId: z.string().uuid(),
    locationIds: z.array(z.string().uuid()).optional()
})

export const userUpdateDTO = z.object({
    username: z.string().min(4, "Username must be at least 4 characters").regex(/^\S*$/, "No spaces allowed").optional(),
    name: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
    roleId: z.string().uuid().optional(),
    locationIds: z.array(z.string().uuid()).optional()
})

export type IUserCreateDTO = z.infer<typeof userCreateDTO>;
export type IUserUpdateDTO = z.infer<typeof userUpdateDTO>;

export type IUser = Selectable<User>;
export type IUserCreate = Insertable<User>;
export type IUserUpdate = Insertable<User>;

export type IUserFilter = IPagination & {
    name?: string
}

