import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { RolesSeeder } from './role.seeder';
import { UsersSeeder } from './user.seeder';
import { PermissionsSeeder } from './permissions.seeder';
import { RolesPermissionsSeeder } from './role-permissions.seeder';

export default class MainSeeder implements Seeder {
  async run(seederDataSource: DataSource): Promise<void> {
    await new PermissionsSeeder().run(seederDataSource);
    await new RolesSeeder().run(seederDataSource);
    await new RolesPermissionsSeeder().run(seederDataSource);
    await new UsersSeeder().run(seederDataSource);
  }
}
