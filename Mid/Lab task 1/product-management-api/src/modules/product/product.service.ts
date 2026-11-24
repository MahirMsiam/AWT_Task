import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts() {
    return await this.productRepository.find({ order: { createdAt: "ASC" } });
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async createProduct(dto: CreateProductDto) {
    const product = this.productRepository.create(dto);
    return await this.productRepository.save(product);
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.getProductById(id);
    Object.assign(product, dto);
    return await this.productRepository.save(product);
  }

  async deleteProduct(id: string) {
    const product = await this.getProductById(id);
    await this.productRepository.remove(product);
    return { message: "Product deleted successfully", id };
  }
}
