import { Injectable, NotFoundException } from '@nestjs/common';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor() {}

  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    const roles = await roleRepository.find({
      where: [{ name: 'super' }, { name: 'admin' }, { name: 'regular' }],
    });

    const getRole = (roleName: string) => {
      const role = roles.find((r) => r.name === roleName);
      if (!role) {
        throw new NotFoundException(`Role "${roleName}" not found.`);
      }
      return role;
    };

    const usersData = [
      { email: 'super@super.com', role: getRole('super') },
      { email: 'admin@admin.com', role: getRole('admin') },
      { email: 'regular@regular.com', role: getRole('regular') }, // remove in production
    ];

    for (const { email, role } of usersData) {
      const existingUser = await userRepository.findOne({ where: { email } });

      if (!existingUser) {
        const user = userRepository.create({
          email,
          password: await hash(email, await genSalt()), // just example
          roles: [role],
        });
        await userRepository.save(user);
        console.log(`✅ Inserted user: ${email}`);
      } else {
        console.log(`⚠️ Skipped existing user: ${email}`);
      }
    }
  }
}
