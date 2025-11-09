import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(name: string, email: string) {
    const user = this.repo.create({ name, email });
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find({
      relations: ['events'],
    });
  }

  findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['events'],
    });
  }

  findMany(ids: string[]) {
    return this.repo.find({
      where: { id: In(ids) },
      relations: ['events'],
    });
  }
}
