import { Query, Resolver } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import UserRoleEnum from '../auth/interfaces/user-role.enum';
import { CurrentSession, ISessionContext } from '../auth/decorators/current-session.decorator';
import { PrismaSelector } from '../../prisma/decorators/prisma-selector.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import UserCurrentResponse from './responses/user-current.response';
import { UserEntity } from '../../generated/prisma-nestjs-graphql';
import { throwCb } from '../../common';

@Resolver('user')
export class UserResolver {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Получить текущего пользователя.
   * @param ctx Контекст текущей сессии пользователя.
   * @param select Запрошенные поля через GraphQL.
   * @returns Текущий авторизованный пользователь.
   * @throws {NotFoundException} Если пользователь не найден (а вдруг?).
   */
  @Query(() => UserCurrentResponse, {
    description: 'Получить текущего пользователя',
  })
  @Roles(UserRoleEnum.Admin, UserRoleEnum.Employee, UserRoleEnum.Student)
  async userCurrent(
    @CurrentSession() ctx: ISessionContext,
    @PrismaSelector<UserCurrentResponse>('user') select: Prisma.UserEntitySelect,
  ): Promise<UserCurrentResponse> {
    return {
      user: await this.prisma.userEntity.findUniqueOrThrow({
        where: { id: ctx.userId },
        select,
      }).catch(throwCb(new NotFoundException('Пользователь не найден'))) as UserEntity,
      roles: ctx.roles,
      accessTokenExpires: ctx.accessTokenExpires,
    };
  }
}
