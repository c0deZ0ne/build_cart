import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MigrationService } from './migration.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('migration')
@ApiTags('migration')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Get()
  async migrate() {
    // this.migrationService.migrate();
  }
  @Get('passwords')
  async migratePasswords() {
    this.migrationService.migratePasswords();
  }
}
