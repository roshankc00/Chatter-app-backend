import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Post,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JWtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginataionDto } from 'src/common/dtos/pagination.dto';
import { FindAllMessageDto } from './dto/findall.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  postme(@Body() data: CreateMessageDto) {
    return this.messagesService.create(data);
  }

  @ApiOperation({
    summary: 'Gell all the messages',
  })
  @ApiResponse({
    status: 200,
    description: 'It will return the  all the messages in an array ',
  })
  @Get()
  @UseGuards(JWtAuthGuard)
  findAll(@Query() query: FindAllMessageDto) {
    return this.messagesService.findAll(query);
  }
  @ApiOperation({
    summary: 'Get the single messsage woth id',
  })
  @ApiResponse({
    status: 200,
    description: 'It will return the message detail of provided id',
  })
  @Get(':id')
  @UseGuards(JWtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @ApiOperation({
    summary: 'update message',
  })
  @ApiResponse({
    status: 200,
    description: 'Update  message of provided id',
  })
  @Patch(':id')
  @UseGuards(JWtAuthGuard)
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @ApiOperation({
    summary: 'Delete the message',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete the message permanently from db ',
  })
  @Delete(':id')
  @UseGuards(JWtAuthGuard)
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
