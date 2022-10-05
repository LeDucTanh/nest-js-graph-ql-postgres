import { PaginatedNews } from './types/paginatedNews';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';
import { CreateNewsInput } from './dto/create-news.input';
import { UpdateNewsInput } from './dto/update-news.input';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/users/users.decorator';
import { User } from 'src/users/entities/user.entity';
import { CoreOutPut } from 'src/common/dtos/output.dto';

@Resolver(() => News)
export class NewsResolver {
  constructor(private readonly newsService: NewsService) {}

  @Query(() => PaginatedNews)
  // @UseGuards(JwtAuthGuard)
  findAll(@Args('page') page: number, @Args('limit') limit: number) {
    return this.newsService.findAll(page, limit);
  }

  @Query(() => PaginatedNews)
  @UseGuards(JwtAuthGuard)
  findMyNews(
    @CurrentUser() user: User,
    @Args('page') page: number,
    @Args('limit') limit: number,
  ) {
    return this.newsService.findMyNews(user.id, page, limit);
  }

  @Mutation(() => CoreOutPut)
  @UseGuards(JwtAuthGuard)
  createNews(
    @CurrentUser() user: User,
    @Args('createNewsInput') createNewsInput: CreateNewsInput,
  ) {
    return this.newsService.createNews(user, createNewsInput);
  }

  @Mutation(() => News)
  @UseGuards(JwtAuthGuard)
  updateNews(
    @CurrentUser() user: User,
    @Args('id') id: number,
    @Args('updateNewsInput') updateNewsInput: CreateNewsInput,
  ) {
    return this.newsService.updateNews(id, updateNewsInput, user.id);
  }

  @Mutation(() => CoreOutPut)
  @UseGuards(JwtAuthGuard)
  deleteNews(@CurrentUser() user: User, @Args('id') id: number) {
    return this.newsService.deleteNews(id, user.id);
  }

  // @Mutation(() => News)
  // removeNews(@Args('id', { type: () => Int }) id: number) {
  //   return this.newsService.remove(id);
  // }
}