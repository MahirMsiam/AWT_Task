import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductTable1795000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "products",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            // Built into PostgreSQL 13+, no uuid-ossp extension needed.
            default: "gen_random_uuid()",
          },
          { name: "name", type: "varchar", length: "100", isNullable: false },
          { name: "category", type: "varchar", length: "50", isNullable: false },
          { name: "price", type: "float", isNullable: false },
          { name: "quantity", type: "int", isNullable: false },
          { name: "created_at", type: "timestamptz", default: "now()" },
          { name: "updated_at", type: "timestamptz", default: "now()" },
        ],
        checks: [
          { name: "CHK_products_price", expression: "price >= 0" },
          { name: "CHK_products_quantity", expression: "quantity >= 0" },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("products");
  }
}
