import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';
import dataSource from 'typeorm.config';
import { EntityManager } from 'typeorm';

const Seeder = async () => {
  const connection = await dataSource.connect();
  const entityManager: EntityManager = connection.manager;
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const user = new User({
    email: 'admin@admin.com',
    password: hashedPassword,
    name: 'admin',
  });
  await entityManager.save(user);
};

Seeder();
