import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "employees" })
export class Employee {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 150, unique: true })
  email!: string;

  @Column({ length: 20 })
  phone!: string;

  // Stored as an argon2 hash and never loaded by normal find queries.
  @Column({ select: false })
  password!: string;

  @Column({ type: "int" })
  age!: number;

  @Column({ type: "int" })
  yearsOfWorking!: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
