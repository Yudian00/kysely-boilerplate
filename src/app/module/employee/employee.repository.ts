import { Kysely } from "kysely";
import { IEmployeeCreate, IEmployeeUpdate } from "./employee.interface";
import { v4 } from "uuid";
import { Database } from "../../../db/database";

export class EmployeeRepository {
    private readonly db: Kysely<Database>
    constructor(db: Kysely<Database>) {
        this.db = db;
    }

    async findAll() {
        const result = await this.db
            .selectFrom('employee')
            .select([
                "employee.name",
                "employee.departmentName",
                "employee.email",
                "employee.joinDate",
                "employee.employeeStatus"
            ])
            .where('employee.deletedAt', 'is', null)
            .execute();


        return result;
    }

    async findById(id: string) {
        const result = await this.db
            .selectFrom('employee')
            .selectAll()
            .where('employee.id', 'is', id)
            .where('employee.deletedAt', 'is', null)
            .executeTakeFirst();

        return result;
    }

    async create(data: IEmployeeCreate) {
        const result = await this.db
            .insertInto('employee')
            .values({
                ...data,
                id: v4(),
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .executeTakeFirstOrThrow();

        return result;
    }

    async update(id: string, data: IEmployeeUpdate) {
        const result = await this.db
            .updateTable('employee')
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where('id', 'is', id)
            .where('deletedAt', 'is', null)
            .executeTakeFirstOrThrow();

        return result;
    }


    async delete(id: string) {
        const result = await this.db
            .updateTable('employee')
            .set({
                deletedAt: new Date()
            })
            .where('id', 'is', id)
            .where('deletedAt', 'is', null)
            .executeTakeFirstOrThrow();

        return result;
    }
}