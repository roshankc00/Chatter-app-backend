import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JWtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Currentuser } from 'src/common/decorators/getCurrentUser.decorator';
import { User } from './entities/user.entity';
import { saveImageToStorage } from 'src/common/file/file.upload.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Gell all the Users',
  })
  @ApiResponse({
    status: 200,
    description: 'It will return the  user details in an array ',
  })
  @Get()
  // @UseGuards(JWtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: 'Get the single user',
  })
  @ApiResponse({
    status: 200,
    description: 'It will return the user details of provided id',
  })
  @Get(':id')
  @UseGuards(JWtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Deactivate User',
  })
  @ApiResponse({
    status: 200,
    description: 'Update user active status to false ',
  })
  @Delete(':id')
  @UseGuards(JWtAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @ApiOperation({
    summary: 'Update the or add the user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Update user profile',
  })
  @Patch('update/profile')
  @UseGuards(JWtAuthGuard)
  @UseInterceptors(FileInterceptor('image', saveImageToStorage))
  updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Currentuser() user: User,
  ) {
    return this.usersService.addOrUpdateProfile(user, file);
  }
}
