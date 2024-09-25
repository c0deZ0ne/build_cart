import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '../user/models/user.model';
import { GetUser } from '../auth/user.decorator';
import { CreationAttributes } from 'sequelize';
import { Blog } from '../blog/models/blog.model';
import { SubBlog } from '../blog/models/subBlog.model';
import { AdminGuard } from '../auth/guards/admin.guard';
import { SubBlogDto } from '../blog/dto/create-sub-blog.dto';
import { BlogDto } from '../blog/dto/create-blog.dto';
import { UpdateBlogDto } from '../blog/dto/update-blog.dto';
import { UpdateSubBlogDto } from '../blog/dto/update-subBlog.dto';

@UseGuards(AdminGuard)
@Controller('admin')
@ApiTags('admin')
export class BlogController {
  constructor(
    @InjectModel(Blog)
    private readonly blogModel: typeof Blog,
    @InjectModel(SubBlog)
    private readonly subBlogModel: typeof SubBlog,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  @ApiBearerAuth()
  @Post('blog/create')
  @ApiOperation({
    summary: 'Create Blog',
  })
  async CreateBlog(
    @GetUser() user: User,
    @Body(ValidationPipe) blogDto: BlogDto,
  ) {
    const { blogTitle, blogContent, image } = blogDto;

    const data = await this.userModel.findOne({
      where: { id: user.id },
    });

    const blog = await this.blogModel.create({
      blogTitle,
      blogContent,
      image,
      UserId: user.id,
      CreatedById: user.id,
      postedBy: data.name,
    });

    await this.createSubBlog(blog, blogDto.subBlogs);
  }
  async createSubBlog(blog: Blog, subBlogDto: SubBlogDto[]) {
    const subBlogs = await Promise.all(
      subBlogDto.map(async ({ subTitle, subContent }) => {
        const subBlog: CreationAttributes<SubBlog> = {
          subTitle,
          subContent,
          BlogId: blog.id,
        };
        return subBlog;
      }),
    );

    await this.subBlogModel.bulkCreate(subBlogs);
  }

  @ApiBearerAuth()
  @Patch('blog/:id')
  @ApiOperation({
    summary: 'Update Blog by Id',
  })
  async updateSingleBlog(
    @Param('id') blogId: string,
    @Body(ValidationPipe) blogDto: UpdateBlogDto,
    @GetUser() user: User,
  ) {
    await this.updateSubBlog(blogId, blogDto, blogDto.subBlogs, user);
  }

  async updateSubBlog(
    blogId: string,
    blogDto: UpdateBlogDto,
    subBlogDto: UpdateSubBlogDto[],
    user: User,
  ) {
    await Promise.all(
      subBlogDto.map(async ({ id, subTitle, subContent }) => {
        await this.subBlogModel.upsert({
          id,
          subTitle,
          subContent,
        });
      }),
    );

    const data = await this.userModel.findOne({
      where: { id: user.id },
      include: [{ model: User, as: 'CreatedBy' }],
    });

    await this.blogModel.update(
      {
        blogTitle: blogDto.blogTitle,
        blogContent: blogDto.blogContent,
        image: blogDto.image,
        UpdatedById: user.id,
        EditedBy: data.name || data.CreatedBy.name,
      },
      { where: { id: blogId } },
    );
  }

  @ApiBearerAuth()
  @Delete('blog/:id')
  @ApiOperation({
    summary: 'Delete Blog by Id',
  })
  async deleteSingleBlog(@Param('id') blogId: string) {
    const row = await this.blogModel.findOne({
      where: { id: blogId },
    });

    if (row) {
      await row.destroy();
    }
  }
}
