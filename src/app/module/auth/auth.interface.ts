import { Insertable, Selectable } from "kysely";
import { User } from "../../../db/db";


export type IUser = Selectable<User>;
export type IUserCreate = Insertable<User>;
export type IUserUpdate = Insertable<User>;