import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { runInTransaction } from 'src/common/helper-functions/transaction.helper';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { safeError } from 'src/common/helper-functions/safe-error.helper';
import { Role } from 'src/role/entities/role.entity';
import { User } from './entities/user.entity';
import { HashingService } from 'src/common/helper-modules/hashing/hashing.service';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { Status, UserQueryDto } from './dto/user-query.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interfce';
import { getSortingOptions } from 'src/common/helper-functions/get-sorting-options.helper';
import { getPaginationOptions } from 'src/common/helper-functions/get-pagination-options.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { getPaginationMeta } from 'src/common/helper-functions/get-pagination-meta.helper';
import { UserSearchableFields } from './constants/user-searchables.constant';
import { applySearch } from 'src/common/helper-functions/search.helper';

@Injectable()
export class UserService {
  constructor(
    private readonly hashingService: HashingService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const [message, error] = await safeError(
      runInTransaction(this.dataSource,async (manager: EntityManager) => {
        const roleRepository = manager.getRepository(Role);
        const [regularRole, _error] = await safeError(
          roleRepository.findOne({
            where: { name: 'regular' },
          }),
        );
        if (_error)
          throw new InternalServerErrorException(
            `Error getting role to assign to the new user.`,
          );
        if (!regularRole)
          throw new NotFoundException(
            'You can not sign up now. Let the developers fix this issue.',
          );

        const userRepository = manager.getRepository(User);
        const existingUser = await userRepository.findOne({
          where: { email: signUpDto.email },
        });
        if (existingUser)
          throw new ConflictException(
            `Email already registered in the system. Continue signing in instead.`,
          );

        const hashedPassword = await this.hashingService.hash(
          signUpDto.password,
        );

        const userInstance = Object.assign(new User(), {
          email: signUpDto.email,
          password: hashedPassword,
          roles: [regularRole],
        });

        const user = userRepository.create(userInstance);
        const savedUser = await userRepository.save(user);

        return {
          success: true,
          message: `User created and saved successfully.`,
        };
      }),
    );
    if (error) throw error;
    return message;
  }

  async signUpUser(signUpUserDto: SignUpUserDto) {
    const [message, error] = await safeError(
      runInTransaction(this.dataSource, async (manager: EntityManager) => {
        const userRepository = manager.getRepository(User);
        const existingUser = await userRepository.findOne({
          where: { email: signUpUserDto.email },
        });
        if (existingUser)
          throw new ConflictException(
            `Email already registered in the system.`,
          );

        const incommingRoleIds = signUpUserDto.roleIds.filter((id) => id !== 1); //dont allow to create a super user
        const roleInstances = await manager.find(Role, {
          where: { id: In(incommingRoleIds) },
        });

        const foundRoleIds = roleInstances.map(
          (roleInstance: Role) => roleInstance.id,
        );

        const missingRoleIds = incommingRoleIds.filter(
          (id: number) => !foundRoleIds.includes(id),
        );
        if (missingRoleIds.length > 0)
          throw new NotFoundException(
            `Role/s not found for id/s: ${missingRoleIds.join(', ')}`,
          );

        const hashedPassword = await this.hashingService.hash(
          signUpUserDto.password,
        );

        const userInstance = Object.assign(new User(), {
          email: signUpUserDto.email,
          password: hashedPassword,
          roles: roleInstances,
        });

        const user = userRepository.create(userInstance);
        const savedUser = await userRepository.save(user);

        return {
          success: true,
          message: `User created and saved successfully.`,
        };
      }),
    );
    if (error) throw error;
    return message;
  }

  async getAllUsers(query: UserQueryDto, loggedInUser: ActiveUserData) {
    const { sortBy, orderBy } = getSortingOptions(query);
    const { skip, take, page, limit } = getPaginationOptions(query);

    const qb = this.userRepository
      .createQueryBuilder('user')
      .withDeleted()
      .leftJoin('user.roles', 'role')
      .select([
        'user.id',
        'user.email',
        'user.createdAt',
        'user.deletedAt',
        'role.name',
      ])
      .where('user.id != :id', { id: loggedInUser.sub });

    if (query.role) {
      qb.andWhere('role.name = :roleName', { roleName: query.role });
    }

    if (query.search) {
      applySearch(qb, query.search, UserSearchableFields, 'user');
    }

    if (query.onlyActive === Status.FALSE) {
      qb.andWhere('user.deletedAt IS NOT NULL');
    } else {
      qb.andWhere('user.deletedAt IS NULL');
    }

    qb.orderBy(`user.${sortBy}`, orderBy);

    if (query.isPaginated == Status.TRUE) {
      qb.skip(skip).take(take);
    }

    const [data, error] = await safeError(qb.getManyAndCount());
    if (error) {
      console.log(error.message);
      throw new InternalServerErrorException(`Error fetching users.`);
    }

    const [users, totalCount] = data;

    if (query.isPaginated === Status.TRUE) {
      return {
        success: true,
        message: 'Users fetched successfully.',
        data: users,
        meta: getPaginationMeta(totalCount, page, limit, users.length),
      };
    }

    return {
      success: true,
      message: 'Users fetched successfully.',
      data: users,
    };
  }
}
