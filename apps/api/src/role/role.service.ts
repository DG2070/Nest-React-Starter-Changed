import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEqual, omit } from 'lodash';
import { safeError } from 'src/common/helper-functions/safe-error.helper';
import { runInTransaction } from 'src/common/helper-functions/transaction.helper';
import { EntityManager, In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdatedInterface } from 'src/common/interfaces/crud-response.interface';
import { Permission } from 'src/permission/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async create(
    createRoleDto: CreateRoleDto,
  ): Promise<{ success: boolean; message: string }> {
    const [message, error] = await safeError(
      runInTransaction(async (manager: EntityManager) => {
        const roleRepository = manager.getRepository(Role);

        const permissionInstances = await this.getPermissionInstances(
          createRoleDto.permissionIds,
          manager,
        );

        let newRole: Role;

        const existingRole: Role | null = await this.findWithName(
          createRoleDto.name,
          manager,
        );
        if (existingRole) {
          newRole = await roleRepository.recover(existingRole);
        } else {
          newRole = new Role();
        }

        Object.assign(newRole, omit(createRoleDto, ['permissionIds']));

        const role = roleRepository.create({
          ...newRole,
          permissions: permissionInstances,
        });

        const savedRole = await roleRepository.save(role);
        return {
          success: true,
          message: `Role created successfully.`,
        };
      }),
    );
    if (error instanceof HttpException) throw error;
    return message!;
  }

  async findAll(): Promise<Role[]> {
    const [roles, error] = await safeError(
      this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.permissions', 'permission')
        .select(['role.id', 'role.name', 'permission.id', 'permission.name'])
        .getMany(),
    );
    if (error) {
      throw new InternalServerErrorException('Error while fetching roles');
    }
    return roles;
  }

  async findOne(id: number, manager?: EntityManager): Promise<Role> {
    const roleRepository = manager
      ? manager.getRepository(Role)
      : this.roleRepository;

    const [role, error] = await safeError(
      roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.permissions', 'permission')
        .where('role.id = :id', { id })
        .select([
          'role.id',
          'role.name',
          'role.description',
          'permission.id',
          'permission.name',
        ])
        .getOne(),
    );

    if (error) {
      console.log(error);
      throw new InternalServerErrorException('Error while fetching roles');
    }
    if (!role) throw new NotFoundException(`Role with id : ${id} not found.`);
    return role;
  }

  async findWithName(
    name: string,
    manager?: EntityManager,
  ): Promise<Role | null> {
    const roleRepository = manager
      ? manager.getRepository(Role)
      : this.roleRepository;
    const [role, error] = await safeError(
      roleRepository.findOne({ where: { name }, withDeleted: true }),
    );
    if (error)
      throw new InternalServerErrorException('Error while retreiving role.');
    if (!role) return null;
    return role;
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<UpdatedInterface> {
    const [message, error] = await safeError(
      runInTransaction(async (manager: EntityManager) => {
        const roleRepository = manager.getRepository(Role);
        const existingRole = await this.findOne(id, manager);
        const existingPermissionIds = existingRole.permissions.map(
          (permission) => permission.id,
        );
        const incommingPermissionIds = updateRoleDto.permissionIds;

        if (isEqual(existingPermissionIds, incommingPermissionIds)) {
          Object.assign(existingRole, {
            ...omit(updateRoleDto, ['permissionIds']),
          });
        } else {
          const permissionInstances = await this.getPermissionInstances(
            updateRoleDto.permissionIds,
            manager,
          );

          Object.assign(existingRole, {
            ...omit(updateRoleDto, ['permissionIds']),
            permissions: permissionInstances,
          });
        }
        const toUpdateRole = roleRepository.create(existingRole);
        const updatedRole = await manager.save(toUpdateRole);
        return {
          success: true,
          message: `Role updated successfully.`,
        };
      }),
    );
    if (error) {
      console.log(error);
      throw error;
    }
    return message;
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const role = await this.findOne(id);
    if (role.name == 'super' || role.name == 'admin')
      throw new ForbiddenException(
        `Role 'super' or 'admin' can not be deleted. `,
      );
    const [deletedRole, Error] = await safeError(
      this.roleRepository.softRemove(role),
    );
    if (Error) throw new InternalServerErrorException(`Error deleting role.`);
    return {
      success: true,
      message: `Role ${role.name} deleted successfully.`,
    };
  }

  async getPermissionInstances(
    permissionIds: number[],
    manager: EntityManager,
  ): Promise<Permission[]> {
    const permissionInstances = await manager.find(Permission, {
      where: { id: In(permissionIds) },
    });

    const foundPermissionIds = permissionInstances.map(
      (permissionInstance: Permission) => permissionInstance.id,
    );

    const missingPermissionIds = permissionIds.filter(
      (id: number) => !foundPermissionIds.includes(id),
    );
    if (missingPermissionIds.length > 0)
      throw new NotFoundException(
        `Permission/s not found for id/s: ${missingPermissionIds.join(', ')}`,
      );
    return permissionInstances;
  }
}
