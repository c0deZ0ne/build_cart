import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateRetailUserDto } from './dto/create-retail-user.dto';
import { CreateRetailTransactionDto } from './dto/create-retail-transaction.dto';
import { RetailService } from './retail.service';

@Controller('retail')
@ApiTags('retail')
export class RetailController {
  constructor(private readonly retailService: RetailService) {}
  @ApiOperation({
    summary: 'Create a new retail user',
  })
  @Post('create-user')
  async createUser(@Body(ValidationPipe) body: CreateRetailUserDto) {
    return await this.retailService.createUser(body);
  }

  @ApiOperation({
    summary: 'Gets all users',
  })
  @ApiQuery({
    name: 'page_size',
    type: Number,
    required: false,
    example: 100,
  })
  @Get('get-users')
  async getUsers(@Query('page_size') page_size?: number) {
    return this.retailService.getAllUsers();
  }

  @ApiOperation({
    summary: 'Gets a retail user by id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'af618e4e-4be4-44a3-8470-ffe765368428',
  })
  @Get('get-users/:id')
  async getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.retailService.getUserById(id);
  }

  @ApiOperation({
    summary: 'Gets a retail user by filter.',
  })
  @ApiParam({
    name: 'filter',
    required: true,
    example: 'feature_product',
  })
  @ApiQuery({
    name: 'page_size',
    type: Number,
    required: false,
    example: 100,
  })
  @Get('get-users/:filter')
  async getUserByFilter(
    @Param('filter') filter: string,
    @Query('page_size') page_size?: number,
  ) {
    return this.retailService.getUserByFilter(filter);
  }
}
