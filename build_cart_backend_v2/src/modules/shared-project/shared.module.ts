import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { SharedProject } from './models/shared-project.model';
// import { SharedProjectService } from './service';
import { InvitationModule } from '../invitation/invitation.module';
import { MyProject } from '../my-project/models/myProjects.model';
import { MyFundManager } from '../my-fundManager/models/myFundManager.model';

@Module({
  imports: [
    SequelizeModule.forFeature([SharedProject, MyProject, MyFundManager]),
    InvitationModule,
    UserModule,
    forwardRef(() => ProjectModule),
  ],
  providers: [], // [SharedProjectService],
  controllers: [],
  exports: [], //[SharedProjectService],
})
export class SharedProjectModule {}
