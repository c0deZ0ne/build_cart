import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/models/user.model';
import { UserLog } from './models/user-log.model';

@Injectable()
export class UserLogService {
    constructor(
        @InjectModel(UserLog)
        private readonly userLogModel: typeof UserLog
    ) { }

    async createLog({ teamMemberId, activityTitle, activityDescription }: {
        activityDescription: string;
        activityTitle: string;
        teamMemberId: string
    }) {
        await this.userLogModel.create({
            teamMemberId, activityTitle, activityDescription
        })
    }
    async getUserLogs(user:User) {
       return  await this.userLogModel.findAll({
            where:{teamMemberId:user.id}
        })
    }
}
