// import { Controller, Get, UseGuards } from '@nestjs/common';
// import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { SponsorGuard } from 'src/modules/auth/guards/fundManager.guard';
// import { GetUser } from 'src/modules/auth/user.decorator';
// import { User } from 'src/modules/user/models/user.model';
// // import { SharedProjectService } from '../shared-project/service';
// @Controller('fundManager')
// @ApiTags('fundManager')
// @ApiBearerAuth()
// @UseGuards(SponsorGuard)
// export class SponsorMyProjectController {
//   constructor(private readonly sharedProjectService: SharedProjectService) {}

//   @ApiOperation({
//     summary: 'get all projects accepted by fundManager',
//   })
//   @Get('accepted-projects')
//   async getMyProjects(@GetUser() user: User) {
//     return await this.sharedProjectService.getAllAcceptedProjects(user);
//   }
// }
