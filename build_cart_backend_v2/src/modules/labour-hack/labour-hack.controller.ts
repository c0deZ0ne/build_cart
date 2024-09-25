import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LabourHackService } from './labour-hack.service';
import { CreateLabourHackDto } from './dto/createLabourHackDto';

@Controller('labour-hack')
@ApiTags('labour-hack')
export class LabourHackController {
  constructor(private readonly labourHackService: LabourHackService) {}

  @ApiOperation({
    summary: 'Create a new labour userType',
  })
  @Post('create-labour-userType')
  async createLabourType(
    @Body(ValidationPipe) createLabourHackDto: CreateLabourHackDto,
  ) {
    return await this.labourHackService.createLabourHack(createLabourHackDto);
  }

  @ApiOperation({
    summary: 'Get all labour types',
  })
  @ApiQuery({
    name: 'page_size',
    type: Number,
    required: false,
    example: 100,
  })
  @Get('get-labour-types')
  async getAllLabourHack(@Query('page_size') page_size?: number) {
    return await this.labourHackService.getAllLabourHack();
  }

  @ApiOperation({
    summary: 'Find a labour userType by ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '283cb63f-710f-46f7-a27b-9b678f33622f',
  })
  @Get('get-labour-userType/:id')
  async getLabourHackById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.labourHackService.getLabourHackById(id);
  }

  @ApiOperation({
    summary: `Get all labour userType's transactions`,
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'e43c2fd9-20c0-4ec3-aa67-608ea0219a10',
  })
  @Get('get-labour-userType-transactions/:id')
  async getLabourHackTransactions(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.labourHackService.getLabourHackTransactions(id);
  }

  @ApiOperation({
    summary: 'Update a labour userType',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'e43c2fd9-20c0-4ec3-aa67-608ea0219a10',
  })
  @Patch('update-labour-userType/:id')
  async updateLabourHack(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateLabourHackDto: CreateLabourHackDto,
  ) {
    return await this.labourHackService.updateLabourHack(
      id,
      updateLabourHackDto,
    );
  }

  @ApiOperation({
    summary: 'Delete a labour userType',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'e43c2fd9-20c0-4ec3-aa67-608ea0219a10',
  })
  @Delete('delete-labour-userType/:id')
  async deleteLabourHackById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.labourHackService.deleteLabourHackById(id);
  }
}
