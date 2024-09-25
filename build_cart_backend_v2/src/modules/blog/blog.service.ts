import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Blog } from './models/blog.model';
import { SubBlog } from './models/subBlog.model';
import { User } from '../user/models/user.model';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog)
    private readonly blogModel: typeof Blog,
  ) {}

  async getAllBlogs() {
    return await this.blogModel.findAll({
      include: [
        {
          model: SubBlog,
        },
        { model: User, as: 'CreatedBy', attributes: ['name', 'email'] },
        { model: User, as: 'UpdatedBy', attributes: ['name', 'email'] },
      ],
    });
  }

  async getSingleBlog(blogId: string) {
    return await this.blogModel.findOrThrow({
      where: { id: blogId },
      include: [
        {
          model: SubBlog,
        },
        { model: User, as: 'CreatedBy', attributes: ['name', 'email'] },
        { model: User, as: 'UpdatedBy', attributes: ['name', 'email'] },
      ],
    });
  }
}
