import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProductService } from 'src/modules/product/services/product.service';
import { ProductDTO } from 'src/modules/vendor/dto/addProductsToVendor';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import {
  filterUniqueCategories,
  generateStoreNumber,
  mergeSpecsAndPrices,
} from 'src/util/util';
import { ProductCategory } from '../../product/models/category.model';
import { ProductMetric } from '../../product/models/metric.model';
import { Product } from '../../product/models/product.model';
import { AddSpecificationAndPriceToVendorProductData } from '../dto/addSpecificationToVendorProduct.dto';
import { VendorProductSpecificationProduct } from '../models/vendor-product-specification-product.model';
import { VendorProductSpecification } from '../models/vendor-product-specification.model';
import { VendorProduct } from '../models/vendor-product.model';
import { VendorRfqCategory } from 'src/modules/vendor/models/vendor-rfqCategory.model';
import { RfqCategory } from 'src/modules/rfq/models';

@Injectable()
export class VendorProductService {
  constructor(
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
    @InjectModel(VendorProduct)
    private readonly vendorProductModel: typeof VendorProduct,
    @InjectModel(VendorProductSpecification)
    private readonly vendorProductSpecificationModel: typeof VendorProductSpecification,
    @InjectModel(VendorProductSpecificationProduct)
    private readonly vendorProductSpecificationProductModel: typeof VendorProductSpecificationProduct,
    @InjectModel(VendorRfqCategory)
    private readonly vendorRfqCategoryModel: typeof VendorRfqCategory,
    private productService: ProductService,
  ) {}

  async getVendorProducts({
    vendorId,
    categoryID,
    searchParam,
  }: {
    vendorId: string;
    categoryID?: string;
    searchParam?: string;
  }) {
    const whereClause: any = {
      vendorId,
    };

    const categoryClause: any = {};

    if (categoryID) {
      categoryClause.categoryID = categoryID;
    }

    if (searchParam) {
      whereClause[Op.or] = [
        {
          '$product.name$': {
            [Op.iLike]: `%${searchParam}%`,
          },
        },
        {
          '$product.category.name$': {
            [Op.iLike]: `%${searchParam}%`,
          },
        },
      ];
    }

    const allProducts = await this.vendorProductModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Product,
          where: {
            ...categoryClause,
          },
          attributes: {
            exclude: [
              'show_on_retail',
              'feature_product',
              'show_on_tracker',
              'categoryID',
              'metricID',
              'createdAt',
              'updatedAt',
            ],
          },
          include: [
            {
              model: ProductCategory,
              as: 'category',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
            {
              model: ProductMetric,
              as: 'metric',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
        },
        {
          model: VendorProductSpecification,
          as: 'specifications',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
          through: {
            attributes: ['id', 'price', 'createdAt', 'updatedAt'],
          },
        },
      ],
    });

    const result = {
      totalProducts: allProducts.rows.length,
      products: allProducts.rows,
    };

    return result;
  }

  async getVendorProductsByCategory(categoryID: string, vendorId: string) {
    return await this.getVendorProducts({ vendorId, categoryID });
  }

  async getVendorProductsForStore(id: string, clause = true) {
    let query;

    if (clause) {
      query = {
        where: {
          vendorId: id,
          product_visibility: true,
        },
      };
    } else {
      query = {
        where: {
          vendorId: id,
        },
      };
    }

    const vendorProducts = await this.vendorProductModel.findAll({
      where: {
        ...query.where,
      },
      attributes: ['id', 'product_visibility'],
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'image_url', 'categoryID'],
          include: [
            {
              model: ProductCategory,
              as: 'category',
              attributes: ['id', 'name'],
            },
            {
              model: ProductMetric,
              as: 'metric',
              attributes: ['id', 'name'],
            },
          ],
        },
        {
          model: VendorProductSpecification,
          as: 'specifications',
          attributes: ['id', 'value'],
          through: {
            attributes: ['id', 'price'],
          },
        },
      ],
    });

    const modifiedVendorProducts = vendorProducts.map((vendorProduct) => {
      const { id, product_visibility, product, specifications } =
        vendorProduct.toJSON();
      return {
        id,
        product_visibility,
        product: {
          ...product,
          specifications,
        },
      };
    });

    const groupedByCategories = modifiedVendorProducts.reduce((acc, curr) => {
      const { category } = curr.product;

      if (!acc[category.name]) {
        acc[category.name] = [];
      }

      acc[category.name].push(curr);

      return acc;
    }, {});

    const categories = Object.keys(groupedByCategories);

    return {
      // vendor,
      categories,
      products: groupedByCategories,
    };
  }

  async getVendorProductsById(id: string) {
    const vendor = await this.vendorModel.findOne({
      where: { id },
      attributes: ['id', 'store_number', 'companyName', 'logo', 'about'],
    });
    if (!vendor) {
      throw new NotFoundException('Store not found');
    }

    const vendorProducts = await this.getVendorProductsForStore(
      vendor.id,
      false,
    );

    return {
      vendor,
      ...vendorProducts,
    };
  }

  async getVisibleVendorStoreProducts(store_number: string) {
    const vendor = await this.vendorModel.findOne({
      where: { store_number },
      attributes: ['id', 'store_number', 'companyName', 'logo', 'about'],
    });
    if (!vendor) {
      throw new NotFoundException('Store not found');
    }

    const vendorProducts = await this.getVendorProductsForStore(vendor.id);

    return {
      vendor,
      ...vendorProducts,
    };
  }

  async searchForVendorProduct(store_number: string, name: string) {
    const vendor = await this.vendorModel.findOne({
      where: { store_number },
      attributes: ['id', 'store_number', 'companyName', 'categories'],
    });
    if (!vendor) {
      throw new NotFoundException('Store not found');
    }

    const vendorProducts = await this.vendorProductModel.findAll({
      where: {
        vendorId: vendor.id,
      },
      attributes: ['id', 'product_visibility'],
      include: [
        {
          model: Product,
          attributes: {
            exclude: [
              'show_on_retail',
              'feature_product',
              'show_on_tracker',
              'metricID',
              'createdAt',
              'updatedAt',
            ],
          },
          where: {
            name: {
              [Op.iLike]: '%' + name + '%',
            },
          },
          include: [
            {
              model: ProductCategory,
              as: 'category',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
            {
              model: ProductMetric,
              as: 'metric',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
        },
        {
          model: VendorProductSpecification,
          as: 'specifications',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
          through: {
            attributes: ['price', 'createdAt', 'updatedAt'],
          },
        },
      ],
    });

    const modifiedVendorProducts = vendorProducts.map((vendorProduct) => {
      const { id, product_visibility, product, specifications } =
        vendorProduct.toJSON();
      return {
        id,
        product_visibility,
        product: {
          ...product,
          specifications,
        },
      };
    });

    return modifiedVendorProducts;
  }

  async getVendorProductByProductSpecification(specificationID: string) {
    const productSpecificationAndProduct =
      await this.vendorProductSpecificationProductModel.findByPk(
        specificationID,
        {
          include: [
            {
              model: VendorProduct,
              as: 'product',
            },
            {
              model: VendorProductSpecification,
              as: 'specification',
            },
          ],
        },
      );

    if (!productSpecificationAndProduct) {
      throw new NotFoundException(
        `Product Specification with ${specificationID} not found`,
      );
    }

    return productSpecificationAndProduct;
  }

  async addProductToVendor(data: { vendorId: string; products: ProductDTO[] }) {
    const { vendorId, products } = data;

    const productCategories = [];
    for (const product of products) {
      const foundProduct = await this.productService.getProductById(
        product.productId,
      );

      if (foundProduct) {
        productCategories.push(foundProduct.categoryID);
      }
    }

    const vendor = await this.vendorModel.findOne({
      where: {
        id: vendorId,
      },
      include: [
        {
          model: RfqCategory,
          as: 'RfqCategories',
          attributes: ['id', 'title'],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!vendor.store_number) {
      const store_number = generateStoreNumber(8);

      await this.vendorModel.update(
        {
          store_number,
        },
        {
          where: {
            id: vendorId,
          },
        },
      );
    }

    const mergedSpecsAndPrices = mergeSpecsAndPrices(products);

    const productsToAdd = [...mergedSpecsAndPrices];

    for (const product of products) {
      const checkIfVendorAlreadyAddedProducts =
        await this.vendorProductModel.findOne({
          where: {
            vendorId,
            productId: product.productId,
          },
        });

      if (checkIfVendorAlreadyAddedProducts) {
        if (product.specsAndPrices && product.specsAndPrices.length > 0) {
          await this.addSpecificationToProduct({
            vendorProductId: checkIfVendorAlreadyAddedProducts.id,
            specsAndPrices: product.specsAndPrices,
          });
        }

        productsToAdd.splice(productsToAdd.indexOf(product), 1);
      } else {
        const vendorProducts = productsToAdd.map((product) => ({
          vendorId,
          productId: product.productId,
        }));

        const createdVendorProducts = await this.vendorProductModel.bulkCreate(
          vendorProducts,
        );

        const associatedProducts = [];

        for (let i = 0; i < createdVendorProducts.length; i++) {
          const { specsAndPrices } = productsToAdd[i];

          const findProduct = await this.vendorProductModel.findOne({
            where: { id: createdVendorProducts[i].id },
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['name'],
              },
            ],
          });
          associatedProducts.push(findProduct.product.name);
          if (specsAndPrices && specsAndPrices.length > 0) {
            for (let j = 0; j < specsAndPrices.length; j++) {
              const { specification, price } = specsAndPrices[j];
              const spec =
                await this.vendorProductSpecificationModel.findOrCreate({
                  where: { value: specification },
                });

              await this.vendorProductSpecificationProductModel.create({
                price: price || null,
                vendorProductId: createdVendorProducts[i].id,
                vendorProductSpecificationId: spec[0].id,
                product_spec: `${associatedProducts} ${specification}`,
              });
            }
          }
        }
      }
    }

    // update vendor categories

    const vendorCategories = vendor.RfqCategories;

    const filteredCategories = productCategories.filter((categoryId) => {
      return !vendorCategories.some(
        (vendorCategory) => vendorCategory.id === categoryId,
      );
    });

    // bulk create vendor rfq categories
    const vendorRfqCategories = filteredCategories.map((categoryId) => ({
      VendorId: vendorId,
      RfqCategoryId: categoryId,
    }));

    const uniqueRfqCategories = filterUniqueCategories(vendorRfqCategories);

    await this.vendorRfqCategoryModel.bulkCreate(uniqueRfqCategories);

    return `${
      products.length > 1 ? 'Products' : 'Product'
    } added to vendor's store successfully`;
  }

  async removeProductFromVendor(data: {
    vendorId: string;
    products: string[];
  }) {
    const { vendorId, products } = data;

    for (const productId of products) {
      const checkIfProductExists = await this.vendorProductModel.findOne({
        where: {
          vendorId,
          productId,
        },
      });

      if (!checkIfProductExists) {
        throw new BadRequestException('This product does not exist');
      }
    }

    return await this.vendorProductModel.destroy({
      where: {
        vendorId,
        productId: products,
      },
    });
  }

  async toggleVendorProductVisibility(id: string, vendorId: string) {
    const vendorProduct = await this.vendorProductModel.findOne({
      where: {
        id,
        vendorId,
      },
    });

    if (!vendorProduct) {
      throw new NotFoundException('Vendor product not found');
    }

    const productVisibility = !vendorProduct.product_visibility;

    await vendorProduct.update({
      product_visibility: productVisibility,
    });

    return {
      message: 'Vendor product visibility updated successfully',
    };
  }

  async findVendorProductById(id: string) {
    return await this.vendorProductModel.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Product,
          attributes: {
            exclude: [
              'show_on_retail',
              'feature_product',
              'show_on_tracker',
              'categoryID',
              'metricID',
              'createdAt',
              'updatedAt',
            ],
          },
        },
      ],
    });
  }

  async addSpecificationToProduct({
    vendorProductId,
    specsAndPrices,
  }: AddSpecificationAndPriceToVendorProductData) {
    if (specsAndPrices.length === 0) {
      throw new BadRequestException('No specification provided');
    }

    const vendorProduct = await this.findVendorProductById(vendorProductId);

    if (!vendorProduct) {
      throw new BadRequestException('Vendor product not found');
    }

    for (let i = 0; i < specsAndPrices.length; i++) {
      const { specification, price } = specsAndPrices[i];
      const spec = await this.vendorProductSpecificationModel.findOrCreate({
        where: { value: specification },
      });

      await this.vendorProductSpecificationProductModel.create({
        price: price || null,
        vendorProductId,
        vendorProductSpecificationId: spec[0].id,
        product_spec: `${vendorProduct.product.name} ${specification}`,
      });
    }

    return vendorProduct;
  }

  async updatePriceOfProductSpecification({
    vendorProductId,
    specsAndPrices,
  }: AddSpecificationAndPriceToVendorProductData) {
    if (specsAndPrices.length === 0) {
      throw new BadRequestException('No specification provided');
    }

    const vendorProduct = await this.findVendorProductById(vendorProductId);

    if (!vendorProduct) {
      throw new BadRequestException('Vendor product not found');
    }

    for (let i = 0; i < specsAndPrices.length; i++) {
      const { specification, price } = specsAndPrices[i];
      const spec = await this.vendorProductSpecificationModel.findOrCreate({
        where: { value: specification },
      });

      await this.vendorProductSpecificationProductModel.update(
        {
          price: price || null,
        },
        {
          where: { vendorProductId, vendorProductSpecificationId: spec[0].id },
        },
      );
    }

    return vendorProduct;
  }

  async deleteVendorProductSpecification(id: string, vendorId: string) {
    const vendorProductSpecification =
      await this.vendorProductSpecificationProductModel.findOne({
        where: {
          id,
        },
        include: [
          {
            model: VendorProduct,
            attributes: ['vendorId'],
          },
        ],
      });

    if (!vendorProductSpecification) {
      throw new BadRequestException('Vendor product specification not found');
    }

    if (vendorProductSpecification.product.vendorId !== vendorId) {
      throw new UnauthorizedException(
        'This product specification does not belong to you',
      );
    }

    await vendorProductSpecification.destroy();

    return {
      message: 'Vendor product specification deleted successfully',
    };
  }
}
