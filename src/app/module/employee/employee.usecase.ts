import { IEmployeeCreate } from "./employee.interface";
import { EmployeeRepository } from "./employee.repository";

export class EmployeeUsecase {
    private readonly employeeRepository: EmployeeRepository

    constructor(employeeRepository: EmployeeRepository) {
        this.employeeRepository = employeeRepository
    }

    async findAll() {
        const result = await this.employeeRepository.findAll()
        return result
    }

    async findById(id: string) {
        const result = await this.employeeRepository.findById(id)
        return result
    }

    async create(data: IEmployeeCreate) {
        const result = await this.employeeRepository.create(data)
        return result
    }

    async update(id: string, data: IEmployeeCreate) {
        const result = await this.employeeRepository.update(id, data)
        return result
    }

    async delete(id: string) {
        const result = await this.employeeRepository.delete(id)
        return result
    }
}