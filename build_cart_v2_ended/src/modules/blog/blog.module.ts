import { Module } from '@nestjs/common';
import { SubBlog } from './models/subBlog.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Blog } from './models/blog.model';
import { BlogController } from '../admin/blog.controller';
import { BlogService } from './blog.service';
import { User } from '../user/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Blog, SubBlog, User])],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
