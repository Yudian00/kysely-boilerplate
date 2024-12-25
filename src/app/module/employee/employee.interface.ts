import { Insertable, Selectable } from "kysely";
import { Employee } from "../../../db/db";


export type IEmployee = Selectable<Employee>;
export type IEmployeeCreate = Insertable<Employee>;
export type IEmployeeUpdate = Insertable<Employee>;