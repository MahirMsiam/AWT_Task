import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import * as argon2 from "argon2";
import { Employee } from "./entities/employee.entity";
import { CreateEmployeeDto, UpdateEmployeeDto } from "./dto/employee.dto";

const UNIQUE_VIOLATION = "23505"; // PostgreSQL error code

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async getEmployees() {
    return await this.employeeRepository.find({ order: { createdAt: "ASC" } });
  }

  async getEmployeeById(id: string) {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async createEmployee(dto: CreateEmployeeDto) {
    this.checkExperience(dto.age, dto.yearsOfWorking);
    const employee = this.employeeRepository.create({
      ...dto,
      email: dto.email.toLowerCase(),
      password: await argon2.hash(dto.password),
    });
    return this.withoutPassword(await this.saveOrConflict(employee));
  }

  async updateEmployee(id: string, dto: UpdateEmployeeDto) {
    const employee = await this.getEmployeeById(id);
    this.checkExperience(
      dto.age ?? employee.age,
      dto.yearsOfWorking ?? employee.yearsOfWorking,
    );
    Object.assign(employee, dto);
    if (dto.email) employee.email = dto.email.toLowerCase();
    if (dto.password) employee.password = await argon2.hash(dto.password);
    return this.withoutPassword(await this.saveOrConflict(employee));
  }

  async deleteEmployee(id: string) {
    const employee = await this.getEmployeeById(id);
    await this.employeeRepository.remove(employee);
    return { message: "Employee deleted successfully", id };
  }

  // Someone who started working at 14 is the youngest we accept.
  private checkExperience(age: number, yearsOfWorking: number) {
    if (yearsOfWorking > age - 14) {
      throw new BadRequestException(
        "Years of working is too high for the given age",
      );
    }
  }

  private async saveOrConflict(employee: Employee) {
    try {
      return await this.employeeRepository.save(employee);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string })?.code === UNIQUE_VIOLATION
      ) {
        throw new ConflictException("An employee with this email already exists");
      }
      throw error;
    }
  }

  private withoutPassword(employee: Employee) {
    const { password: _password, ...rest } = employee;
    return rest;
  }
}
