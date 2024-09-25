import { Injectable } from '@nestjs/common';
import { RfqService } from '../rfq/rfq.service';
import { UserService } from '../user/user.service';
import { ContractService } from '../contract/contract.service';
import { BlogService } from '../blog/blog.service';

@Injectable()
export class OpenApiService {
  constructor(
    private readonly rfqService: RfqService,
    private readonly userService: UserService,
    private readonly contractService: ContractService,
    private readonly blogService: BlogService,
  ) {}

  async getStats() {
    let noOfBuilder = 0;
    let noOfVendor = 0;

    const users = await this.userService.getAllUsersOpen();
    const categories = await this.rfqService.fetchCategories();
    const satisfiedOrders = await this.contractService.getAllsatisfiedOrders();
    const numberOfRfqItems = await this.rfqService.fetchItems();

    users.forEach((user) => {
      if (user.userType === 'BUILDER') {
        noOfBuilder += 1;
      }

      if (user.userType === 'SUPPLIER') {
        noOfVendor += 1;
      }
    });

    return {
      buyers: noOfBuilder,
      vendors: noOfVendor,
      productCategories: categories.length,
      satisfiedOrders: satisfiedOrders.count,
      sku: numberOfRfqItems.length,
    };
  }

  getMaterialData() {
    return [
      {
        sn: 1,
        materialName: 'Material 1',
        description: 'Description 1',
        category: 'Category 1',
        budget: 100,
      },
      {
        sn: 2,
        materialName: 'Material 2',
        description: 'Description 2',
        category: 'Category 2',
        budget: 150,
      },
    ];
  }
}
