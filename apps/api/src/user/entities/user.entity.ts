import { IsPhoneNumber } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Role } from 'src/role/entities/role.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class User extends CommonEntity {
  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({ type: 'varchar', nullable: true })
  authProvider: 'local' | 'google' | null;

  @Column({ type: 'varchar', nullable: true })
  providerId: string | null;

  //this was for Role Guard
  // @Column({ enum: Role, default: Role.Regular })
  // role: Role;

  @ManyToMany(() => Role, (role) => role.users, { onDelete: 'CASCADE' })
  roles: Role[];
}
