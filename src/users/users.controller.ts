import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() body: { name: string; email: string }) {
    return this.usersService.create(body.name, body.email);
  }

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
