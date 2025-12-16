import { Injectable } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AllRoles } from 'src/auth/enums/roles.enum';
import { Role } from 'src/role/entities/role.entity';
import { DataSource, ILike } from 'typeorm';
import { Seeder } from 'typeorm-extension';

@Injectable()
export class RolesSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);

    const roles = Object.values(AllRoles);

    for (const roleName of roles) {
      const existingRole = await roleRepository.findOne({
        where: { name: ILike(roleName) },
      });

      if (!existingRole) {
        const role = roleRepository.create({ name: roleName });
        await roleRepository.save(role);
        console.log(`✅ Inserted role: ${roleName}`);
      } else {
        console.log(`⚠️ Skipped existing role: ${existingRole.name}`);
      }
    }
  }
}
