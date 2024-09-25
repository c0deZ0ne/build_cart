import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/modules/user/models/user.model';
import { TeamMember } from '../rbac/models/user-teammembers.model';
import { Team } from '../rbac/models/team.model';

@Module({
  imports: [UserModule, SequelizeModule.forFeature([User, Team, TeamMember])],
  providers: [TeamService],
  controllers: [TeamController],
})
export class TeamModule {}
