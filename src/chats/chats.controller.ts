import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JWtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  // @UseGuards(JWtAuthGuard)
  post() {
    return this.chatsService.findAll();
  }
  @Get()
  // @UseGuards(JWtAuthGuard)
  findAll() {
    return this.chatsService.findAll();
  }

  @Get(':id')
  // @UseGuards(JWtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(+id);
  }
}
