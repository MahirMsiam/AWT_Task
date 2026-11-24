import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateEmployeeTable1795000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "employees",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "gen_random_uuid()",
          },
          { name: "name", type: "varchar", length: "100", isNullable: false },
          {
            name: "email",
            type: "varchar",
            length: "150",
            isNullable: false,
            isUnique: true,
          },
          { name: "phone", type: "varchar", length: "20", isNullable: false },
          { name: "password", type: "varchar", isNullable: false },
          { name: "age", type: "int", isNullable: false },
          { name: "years_of_working", type: "int", isNullable: false },
          { name: "created_at", type: "timestamptz", default: "now()" },
          { name: "updated_at", type: "timestamptz", default: "now()" },
        ],
        checks: [
          { name: "CHK_employees_age", expression: "age BETWEEN 18 AND 100" },
          {
            name: "CHK_employees_years_of_working",
            expression: "years_of_working >= 0",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("employees");
  }
}
