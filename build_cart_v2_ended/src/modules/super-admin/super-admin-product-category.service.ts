import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../product/models/product.model';
import { ProductCategory } from '../product/models/category.model';
import { RfqCategory, RfqItem, RfqRequestMaterial } from '../rfq/models';
import { VendorProduct } from '../vendor-product/models/vendor-product.model';
import { Order, OrderStatus } from '../order/models';
import { DeliverySchedule } from '../order/models/order-schedule.model';
import { Contract, ContractDeliveryStatus } from '../contract/models';
import { Op, WhereOptions } from 'sequelize';
import {
  CreateProductDto,
  UpdateProductDto,
} from './dto/super-admin-create-project-categoryDto';
import { ProductMetric } from '../product/models/metric.model';
import { ProductSpecification } from '../product/models/specification.model';
import { ProductSpecificationProduct } from '../product/models/productSpecification.model';
import * as moment from 'moment';

@Injectable()
export class SuperAdminProductService {
  constructor(
    @InjectModel(ProductCategory)
    private readonly productCategoryModel: typeof ProductCategory,
    @InjectModel(VendorProduct)
    private readonly vendorProductModel: typeof VendorProduct,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(RfqRequestMaterial)
    private readonly rfqRequestMaterialModel: typeof RfqRequestMaterial,

    @InjectModel(Product)
    private readonly productModel: typeof Product,
    @InjectModel(ProductMetric)
    private readonly productMetricModel: typeof ProductMetric,
    @InjectModel(ProductSpecification)
    private readonly productSpecificationModel: typeof ProductSpecification,
    @InjectModel(ProductSpecificationProduct)
    private readonly productSpecificationProductModel: typeof ProductSpecificationProduct,
  ) {}


  async getActiveOrders() {
    const orders = await this.orderModel.findAll({
      attributes: [
        'id',
        'paidAt',
        'orderVerified',
        'createdAt',
        'status',
        'BuilderId',
        'ContractId',
      ],
      include: [
        {
          model: Contract,
          where: {
            deliveryStatus: {
              [Op.in]: [ContractDeliveryStatus.DISPATCHED],
            },
          },
          attributes: [
            'id',
            'deliveryStatus',
            'status',
            'paymentStatus',
            'paidAt',
          ],
        },
        {
          model: DeliverySchedule,
          where: {
            status: { [Op.eq]: OrderStatus.ONGOING },
          },
        },
        { model: RfqRequestMaterial, include: [{ model: RfqCategory }] },
      ],
    });

    return orders;
  }

  async completedOrders() {
    const orders = await this.orderModel.findAll({
      include: [
        {
          model: Contract,
          attributes: [
            'id',
            'deliveryStatus',
            'status',
            'paymentStatus',
            'paidAt',
            'totalCost',
          ],
          where: {
            deliveryStatus: {
              [Op.in]: [
                ContractDeliveryStatus.DISPATCHED,
                ContractDeliveryStatus.DELIVERED,
                ContractDeliveryStatus.INREVIEW,
              ],
            },
          },
        },
        {
          model: DeliverySchedule,
          where: { status: OrderStatus.COMPLETED },
          include: [
            {
              model: RfqRequestMaterial,
              attributes: [
                'id',
                'name',
                'quantity',
                'status',
                'budget',
                'description',
                'status',
              ],
            },
          ],
        },
        { model: RfqRequestMaterial, include: [{ model: RfqCategory }] },
      ],
    });
    return orders;
  }

  async getProductCategory(categoryId: string) {
    const category = await this.productCategoryModel.findOne({
      where: { id: categoryId },
      include: [{ model: Product }],
    });

    const allProducts = await this.productModel.findAll({
      where: { categoryID: categoryId },
      include:[{model:ProductCategory},{model:ProductSpecification},{model:ProductMetric}]
    });

    const orders = await this.orderModel.findAll({
      include: [
        {
          model: RfqRequestMaterial,
          include: [{ model: RfqCategory, where: { id: categoryId } },{model:RfqItem}],
        },
      ],
    });

    const vendorProducts = await this.vendorProductModel.findAll({
      include: [
        {
          model: Product,
          where: { categoryID: categoryId },
        },
      ],
    });

    const productCategoryCount = {};

    vendorProducts.forEach((product) => {
      const categoryName = product.product.name;

      if (productCategoryCount.hasOwnProperty(categoryName)) {
        productCategoryCount[categoryName]++;
      } else {
        productCategoryCount[categoryName] = 1;
      }
    });

    const activeOrder = await this.getActiveOrder(categoryId);
    const completedOrder = await this.completedOrder(categoryId);

    const totalProductOrders = {};
    const totalActiveOrders = {};
    const totalRevenue = {};
    let totalRevenue_Contracts = 0

    orders.forEach((order) => {
      if (order.RfqRequestMaterial) {
        const categoryName = order.RfqRequestMaterial.name;

        if (totalProductOrders.hasOwnProperty(categoryName)) {
          totalProductOrders[categoryName]++;
        } else {
          totalProductOrders[categoryName] = 1;
        }
      }
    });

    activeOrder.forEach((order) => {
      if (order.RfqRequestMaterial) {
        const categoryName = order.RfqRequestMaterial.name;

        if (totalActiveOrders.hasOwnProperty(categoryName)) {
          totalActiveOrders[categoryName]++;
        } else {
          totalActiveOrders[categoryName] = 1;
        }
      }
    });

    completedOrder.forEach((order) => {
      if (order.RfqRequestMaterial) {
        const categoryName = order.RfqRequestMaterial.name;
        if (totalRevenue.hasOwnProperty(categoryName)) {
          totalRevenue[categoryName] += Number(order.RfqRequestMaterial.budget);
          totalRevenue_Contracts+= Number(order.Contract.totalCost||0)

        } else {
          totalRevenue[categoryName] = Number(order.RfqRequestMaterial.budget);
          totalRevenue_Contracts+= Number(order.Contract.totalCost||0)

        }
      }
    });

    const products = allProducts.map((product) => {
      return {
        id: product.id,
        name: product.name,
        specification: product.specifications[0].value||"unavailable",
        measurement: product.metric.name||"unavailable",
        vendorProductCount: productCategoryCount[product.name] ?? 0,
        totalOrders: totalProductOrders[product.name] ?? 0,
        activeOrders: totalActiveOrders[product.name] ?? 0,
        totalRevenue: totalRevenue[product.name] ?? 0,
        pauseStatus: product.product_visibility,
      };
    });

    return {
      name: category.name,
      productCount: category.products.length,
      vendorProductCount: vendorProducts.length,
      totalOrders: orders.length,
      activeOrders: activeOrder.length,
      totalRevenue: totalRevenue_Contracts,
      products,
    };
  }

  async getActiveOrder(categoryId: string) {
    const orders = await this.orderModel.findAll({
      attributes: [
        'id',
        'paidAt',
        'orderVerified',
        'createdAt',
        'status',
        'BuilderId',
        'ContractId',
      ],
      include: [
        {
          model: Contract,
          where: {
            deliveryStatus: {
              [Op.in]: [ContractDeliveryStatus.DISPATCHED],
            },
          },
          attributes: [
            'id',
            'deliveryStatus',
            'status',
            'paymentStatus',
            'paidAt',
          ],
        },
        {
          model: DeliverySchedule,
          where: {
            status: { [Op.eq]: OrderStatus.ONGOING },
          },
        },
        {
          model: RfqRequestMaterial,
          include: [{ model: RfqCategory, where: { id: categoryId } }],
        },
      ],
    });

    return orders;
  }

  async  completedOrder(categoryId: string) {
    const orders = await this.orderModel.findAll({
      include: [
        {
          model: Contract,
          attributes: [
            'id',
            'deliveryStatus',
            'status',
            'paymentStatus',
            'paidAt',
            'totalCost',
          ],
          where: {
            deliveryStatus: {
              [Op.in]: [
                ContractDeliveryStatus.DISPATCHED,
                ContractDeliveryStatus.DELIVERED,
                ContractDeliveryStatus.INREVIEW,
              ],
            },
          },
        },
        {
          model: DeliverySchedule,
          where: { status: OrderStatus.COMPLETED },
          include: [
            {
              model: RfqRequestMaterial,
              attributes: [
                'id',
                'name',
                'quantity',
                'status',
                'budget',
                'description',
                'status',
              ],
            },
          ],
        },
        {
          model: RfqRequestMaterial,
          include: [{ model: RfqCategory, where: { id: categoryId } }],
        },
      ],
    });
    return orders;
  }

  async createProduct(data: CreateProductDto) {
    const { name, items } = data;

    const category = await this.productCategoryModel.findOrCreate({
      where: { name },
    });

    items.map(async (item) => {
      const measurement = await this.productMetricModel.findByPk(item.metricId);

      if (!measurement) {
        throw new BadRequestException('This metric id does not exist');
      }
      const checkIfProductExists = await this.productModel.findOne({
        where: { name },
      });
      if (checkIfProductExists) {
        throw new BadRequestException(
          'This product already exists, add a specification to it instead',
        );
      }

      const product = await this.productModel.create({
        name,
        categoryID: category[0].id,
        metricID: item.metricId,
        ...item,
      });

      if (item.specsAndPrices && item.specsAndPrices.length > 0) {
        for (let i = 0; i < item.specsAndPrices.length; i++) {
          const { specification, price } = item.specsAndPrices[i];
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
    });

    const returnedProduct = await this.productCategoryModel.findOne({
      where: { id: category[0].id },
      include: [{ model: Product }],
    });

    return returnedProduct;
  }

  async editProduct(productId: string, data: UpdateProductDto) {
    const { name, quantity, measurement, price } = data;
    const product = await this.productModel.findOne({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('product does not exist');

    const updatedData = await this.productModel.update(
      {
        name: name ? name : null,
        price_range: price ? price : null,
      },
      { where: { id: productId }, returning: true },
    );

    if (measurement) {
      await this.productMetricModel.update(
        {
          name: measurement.name,
        },
        { where: { id: measurement.id }, returning: true },
      );
    }
    const [affectedCount, affectedRows] = updatedData;
    return affectedRows[0];
  }

  async pauseProduct(productId: string, product_visibility: boolean) {
    const product = await this.productModel.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('product does not exist');

    const updatedData = await this.productModel.update(
      { product_visibility },
      { where: { id: productId }, returning: true },
    );

    const [affectedCount, affectedRows] = updatedData;
    return affectedRows[0];
  }

  async pauseCategory(categoryId: string, product_visibility: boolean) {
    const category = await this.productCategoryModel.findOne({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException('category does not exist');

    const updatedData = await this.productCategoryModel.update(
      { product_visibility },
      { where: { id: categoryId }, returning: true },
    );

    const [affectedCount, affectedRows] = updatedData;
    return affectedRows[0];
  }

  async getProductCategories({CategoryStatus,search_param}:{CategoryStatus:string,search_param:string}) {
    const query: WhereOptions<ProductCategory>={ };
    if(search_param){
      query.name= search_param
    }
    if(CategoryStatus){
      if(CategoryStatus=="PAUSE"){
        query.product_visibility=false
      }else if(CategoryStatus=="ACTIVE"){
        query.product_visibility=true
      }
    }
    const categories = await this.productCategoryModel.findAll({
      include: [{ model: Product }],
      where: query
    });
  
    const orders = await this.orderModel.findAll({
      include: [
        { model: RfqRequestMaterial, include: [{ model: RfqCategory }] },
      ],
    });
  
    const vendorProducts = await this.vendorProductModel.findAll({
      include: [
        {
          model: Product,
          include: [{ model: ProductCategory }],
        },
      ],
    });
  
    const productCategoryCount = vendorProducts.reduce((count, product) => {
      const categoryName = product.product.category.name;
      count[categoryName] = (count[categoryName] || 0) + 1;
      return count;
    }, {});
  
    const totalCategoryOrders = orders.reduce((totalOrders, order) => {
      const categoryName = order.RfqRequestMaterial.category.title;
      totalOrders[categoryName] = (totalOrders[categoryName] || 0) + 1;
      return totalOrders;
    }, {});
  
    const activeOrders = await this.getActiveOrders();
    const completedOrders = await this.completedOrders();
  
    const totalActiveOrders = activeOrders.reduce((activeOrdersCount, order) => {
      const categoryName = order.RfqRequestMaterial.category.title;
      activeOrdersCount[categoryName] = (activeOrdersCount[categoryName] || 0) + 1;
      return activeOrdersCount;
    }, {});
  
    const totalRevenue = completedOrders.reduce((revenue, order) => {
      const categoryName = order.RfqRequestMaterial.category.title;
      revenue[categoryName] = (revenue[categoryName] || 0) + Number(order.Contract.totalCost || 0);
      return revenue;
    }, {});
  
    const result = categories.map((cat) => {
      return {
        id: cat.id,
        name: cat.name,
        products:cat.products,
        productCount: cat.products.length,
        vendorProductCount: productCategoryCount[cat.name] || 0,
        totalOrders: totalCategoryOrders[cat?.name] || 0,
        activeOrders: totalActiveOrders[cat.name] || 0,
        totalRevenue: totalRevenue[cat.name] || 0,
        pausedStatus: cat.product_visibility,
      };
    });
  
    return result;
  }
  
}
