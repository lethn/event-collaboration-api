import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repo: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  it('creates a user', async () => {
    const user = { id: '1', name: 'A', email: 'a@example.com' };
    repo.create.mockReturnValue(user);
    repo.save.mockResolvedValue(user);

    const result = await service.create('A', 'a@example.com');
    expect(result).toBe(user);
  });

  it('finds all users', async () => {
    repo.find.mockResolvedValue([{ id: '1' }]);
    const result = await service.findAll();
    expect(result.length).toBe(1);
  });
});
