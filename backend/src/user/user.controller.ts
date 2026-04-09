import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { FirebaseStoreAuthGuard } from '../firebase/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Controller('users')
@UseGuards(FirebaseStoreAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('ADMIN')
  async findAll(@Request() req) {
    return this.userService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @Roles('ADMIN')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.userService.findOne(id, req.user.tenantId);
  }

  @Post()
  @Roles('ADMIN')
  async create(@Body() dto: CreateUserDto, @Request() req) {
    return this.userService.create(dto, req.user.tenantId);
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Request() req) {
    return this.userService.update(id, dto, req.user.tenantId);
  }

  @Patch(':id/toggle')
  @Roles('ADMIN')
  async toggle(@Param('id') id: string, @Body('active') active: boolean, @Request() req) {
    return this.userService.toggleStatus(id, active, req.user.tenantId);
  }
}
