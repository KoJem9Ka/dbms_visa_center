import { Field, ObjectType } from '@nestjs/graphql';
import UserRoleEnum from '../../auth/interfaces/user-role.enum';
import { UserEntity } from '../../../generated/prisma-nestjs-graphql';

/**
 * Ответ на запрос получения текущего пользователя.
 */
@ObjectType()
export default class UserCurrentResponse {
  /**
   * Текущий пользователь.
   */
  @Field(() => UserEntity, { description: 'Текущий пользователь' })
  user: UserEntity;

  /**
   * Роли текущего пользователя.
   */
  @Field(() => [UserRoleEnum], { description: 'Роли текущего пользователя' })
  roles: UserRoleEnum[];

  /**
   * Дата истечения токена доступа.
   */
  @Field(() => Date, { description: 'Дата истечения токена доступа' })
  accessTokenExpires: Date;
}
