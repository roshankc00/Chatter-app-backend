import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JWtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateChatDto } from './dto/create-chat.dto';

@ApiTags('chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @UseGuards(JWtAuthGuard)
  getAllChats() {
    return this.chatsService.findAll();
  }

  @Post()
  createChat(@Body() data: CreateChatDto) {
    return this.chatsService.create(data);
  }

  @ApiOperation({
    summary: 'Get all the chats ',
  })
  @ApiResponse({
    status: 200,
    description:
      'It will return the  all the chats in an array with message the user involved details ',
  })
  @Get()
  @UseGuards(JWtAuthGuard)
  findAll() {
    return this.chatsService.findAll();
  }

  @ApiOperation({
    summary: 'Get single chat ',
  })
  @ApiResponse({
    status: 200,
    description:
      'It will return the  single  chat with message the user involved details ',
  })
  @Get(':id')
  @UseGuards(JWtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(+id);
  }
}
