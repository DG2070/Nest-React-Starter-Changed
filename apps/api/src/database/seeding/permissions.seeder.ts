import { Injectable } from '@nestjs/common';
import { Seeder } from 'typeorm-extension';
import { DataSource, ILike } from 'typeorm';
import { Permission } from 'src/permission/entities/permission.entity';
import { RolePermissions } from 'src/auth/enums/role-permission.enum';

@Injectable()
export class PermissionsSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const permissionRepository = dataSource.getRepository(Permission);

    const permissions = Object.values(RolePermissions);

    for (const permissionName of permissions) {
      const existingPermission = await permissionRepository.findOne({
        where: { name: ILike(permissionName) },
      });

      if (!existingPermission) {
        const permission = permissionRepository.create({
          name: permissionName.toLowerCase(),
        });
        await permissionRepository.save(permission);
        console.log(`✅ Inserted permission: ${permissionName}`);
      } else {
        console.log(
          `⚠️ Skipped existing permission: ${existingPermission.name}`,
        );
      }
    }
  }
}
