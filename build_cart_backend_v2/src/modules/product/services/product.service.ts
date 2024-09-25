import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateProductDto } from '../dto/createProductDto';
import { UpdateProductDto } from '../dto/updateProductDto';
import { ProductCategory } from '../models/category.model';
import { ProductMetric } from '../models/metric.model';
import { Product } from '../models/product.model';
import { ProductSpecificationProduct } from '../models/productSpecification.model';
import { ProductSpecification } from '../models/specification.model';
import { ProductCategoryService } from './category.service';
import { ProductMetricService } from './metric.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    @InjectModel(ProductMetric)
    private readonly productMetricModel: typeof ProductMetric,
    @InjectModel(ProductCategory)
    private readonly productCategoryModel: typeof ProductCategory,
    @InjectModel(ProductSpecification)
    private readonly productSpecificationModel: typeof ProductSpecification,
    @InjectModel(ProductSpecificationProduct)
    private readonly productSpecificationProductModel: typeof ProductSpecificationProduct,
    private productCategoryService: ProductCategoryService,
    private productMetricService: ProductMetricService,
  ) {}

  async createProduct(data: CreateProductDto) {
    const { name, categoryID, metricID, specsAndPrices, ...rest } = data;

    await this.productCategoryService.getCategoryById(categoryID);
    await this.productMetricService.getMetricById(metricID);

    const checkIfProductExists = await this.getProductByName(name);

    if (checkIfProductExists) {
      throw new BadRequestException(
        'This product already exists, add a specification to it instead',
      );
    }

    const product = await this.productModel.create({
      name,
      categoryID,
      metricID,
      ...rest,
    });

    if (specsAndPrices && specsAndPrices.length > 0) {
      for (let i = 0; i < specsAndPrices.length; i++) {
        const { specification, price } = specsAndPrices[i];
        const spec = await this.productSpecificationModel.findOrCreate({
          where: { value: specification },
        });

        await this.productSpecificationProductModel.create({
          productId: product.id,
          productSpecificationId: spec[0].id,
          price: price || null,
        });
      }
    }

    const returnedProduct = await this.getProductById(product.id);

    return returnedProduct;
  }

  async getAllProducts() {
    return await this.productModel.findAll({
      include: [
        {
          model: ProductCategory,
          as: 'category',
        },
        {
          model: ProductMetric,
          as: 'metric',
        },
        'specifications',
      ],
    });
  }

  async getAllProductsWithIDs(ids: string[]) {
    return await this.productModel.findAll({
      where: {
        id: ids,
      },
      include: [
        {
          model: ProductCategory,
          as: 'category',
        },
        {
          model: ProductMetric,
          as: 'metric',
        },
        'specifications',
      ],
    });
  }

  async getProductById(id: string) {
    const product = await this.productModel.findByPk(id, {
      include: [
        {
          model: ProductCategory,
          as: 'category',
        },
        {
          model: ProductMetric,
          as: 'metric',
        },
        'specifications',
      ],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getProductByName(name: string) {
    const product = await this.productModel.findOne({
      where: { name },
    });

    if (!product) {
      return null;
    }

    return product;
  }

  async getProductsByCategory(categoryID: string) {
    await this.productCategoryService.getCategoryByName(categoryID);

    return await this.productModel.findAll({
      where: { categoryID },
      include: [
        {
          model: ProductCategory,
          as: 'category',
        },
        {
          model: ProductMetric,
          as: 'metric',
        },
        'specifications',
      ],
    });
  }

  async searchForProduct(name: string): Promise<Product[]> {
    return this.productModel.findAll({
      where: {
        name: {
          [Op.iLike]: '%' + name + '%',
        },
      },
      include: [
        {
          model: ProductCategory,
          as: 'category',
        },
        {
          model: ProductMetric,
          as: 'metric',
        },
        'specifications',
      ],
    });
  }

  async getAllProductsByProperty(property: string) {
    if (
      ![
        'show_on_retail',
        'feature_product',
        'show_on_tracker',
        'top_selling_item',
        'is_todays_pick',
      ]?.includes(property)
    ) {
      throw new BadRequestException('Invalid property');
    }

    const query = {};
    query[property] = true;
    return await this.productModel.findAll({
      where: query,
      include: [
        {
          model: ProductCategory,
          as: 'category',
        },
        {
          model: ProductMetric,
          as: 'metric',
        },
        'specifications',
      ],
    });
  }

  async getProductByProductSpecification(specificationID: string) {
    const productSpecificationAndProduct =
      await this.productSpecificationProductModel.findByPk(specificationID, {
        include: [
          {
            model: Product,
            as: 'product',
          },
          {
            model: ProductSpecification,
            as: 'specification',
          },
        ],
      });

    if (!productSpecificationAndProduct) {
      throw new NotFoundException(
        `Product Specification with ${specificationID} not found`,
      );
    }

    return productSpecificationAndProduct;
  }

  async addSpecificationToProduct(
    productId: string,
    specsAndPrices: {
      specification: string;
      price: number;
    }[],
  ) {
    if (specsAndPrices.length === 0) {
      throw new BadRequestException('No specification provided');
    }

    const product = await this.productModel.findByPk(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    for (let i = 0; i < specsAndPrices.length; i++) {
      const { specification, price } = specsAndPrices[i];
      const spec = await this.productSpecificationModel.findOrCreate({
        where: { value: specification },
      });

      await this.productSpecificationProductModel.create({
        price: price || null,
        productId,
        productSpecificationId: spec[0].id,
      });
    }

    return product;
  }

  async updateSpecificationPrice(
    productId: string,
    specsAndPrices: {
      specification: string;
      price: number;
    }[],
  ) {
    if (specsAndPrices.length === 0) {
      throw new BadRequestException('No specification provided');
    }

    const product = await this.productModel.findByPk(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    for (let i = 0; i < specsAndPrices.length; i++) {
      const { specification, price } = specsAndPrices[i];
      const spec = await this.productSpecificationModel.findOrCreate({
        where: { value: specification },
      });

      await this.productSpecificationProductModel.update(
        {
          price: price || null,
        },
        {
          where: { productId, productSpecificationId: spec[0].id },
        },
      );
    }

    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const { categoryID, metricID, name } = updateProductDto;

    const emptyPayload = Object.keys(updateProductDto).length === 0;
    if (emptyPayload) {
      throw new BadRequestException('Include data to update');
    }

    if (name) {
      const product = await this.getProductByName(name);
      if (product) {
        throw new BadRequestException('Product already exists');
      }
    }
    if (categoryID) {
      const category = await this.productCategoryService.getCategoryById(
        categoryID,
      );
      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    if (metricID) {
      const metric = await this.productMetricService.getMetricById(metricID);
      if (!metric) {
        throw new BadRequestException('Metric not found');
      }
    }

    const updatedProduct = await this.productModel.update(updateProductDto, {
      where: { id },
    });

    if (!updatedProduct[0]) {
      throw new BadRequestException('Product not found');
    }

    const findUpdatedProduct = await Product.findOne({
      where: { id },
      include: [
        {
          model: ProductCategory,
          as: 'category',
        },
        {
          model: ProductMetric,
          as: 'metric',
        },
        'specifications',
      ],
    });

    return findUpdatedProduct;
  }

  async deleteProductById(id: string) {
    const product = await this.productModel.destroy({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
