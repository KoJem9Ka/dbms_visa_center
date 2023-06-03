import {
  Args, Mutation, Query, Resolver,
} from '@nestjs/graphql';
import { StudentVisaRequestEntity } from '@prisma-nestjs-graphql';
import { PartialDeep } from 'type-fest';
import { UUID } from '@common/scalars';
import { Prisma } from '@prisma/client';
import { ifDebug, isRoleStudent, throwCb } from '@common';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import ms from 'ms';
import { PrismaService } from '../../prisma/prisma.service';
import { Roles } from '../auth/decorators/roles.decorator';
import UserRoleEnum from '../auth/interfaces/user-role.enum';
import { PrismaSelector } from '../../prisma/decorators/prisma-selector.decorator';
import { CurrentSession, ISessionContext } from '../auth/decorators/current-session.decorator';
import { StudentVisaRequestUpsertInput } from './inputs/student-visa-request-upsert.input';

/**
 * Резолвер для работы с визовыми анкетами студентов.
 */
@Resolver('visa-request')
export class VisaRequestResolver {
  // TODO: Как часто создаются новые визовые анкеты? Что делать, с тем что их может быть несколько?
  private readonly visaRequestAgeLimit = ms('1y');

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Получение визовых анкет всех или одного студента.
   * @param select Поля, запрошенные через GraphQL.
   * @param session Текущая сессия.
   * @param studentId UUID Студента, которого нужны визовые анкеты.
   *    Если не указан, то сотрудникам будут возвращены все анкеты всех студентов,
   *    а студентам только их собственные.
   * @returns Визовые анкеты.
   * @throws {ForbiddenException} Студенты не могут читать чужие визовые анкеты.
   */
  @Query(() => [StudentVisaRequestEntity], {
    description: 'Получение визовых анкет всех или одного студента.',
  })
  @Roles(UserRoleEnum.Admin, UserRoleEnum.Employee, UserRoleEnum.Student)
  async visaRequests(
    @PrismaSelector() select: Prisma.StudentPassportEntitySelect,
    @CurrentSession() session: ISessionContext,
    @Args('studentId', { type: UUID, nullable: true }) studentId?: string,
  ): Promise<PartialDeep<StudentVisaRequestEntity>[]> {
    const isUserIsStudent = isRoleStudent(session.roles);
    if (isUserIsStudent && studentId && studentId !== session.userId) {
      throw new ForbiddenException(ifDebug('Студенты не могут читать чужие визовые анкеты'));
    }
    return this.prisma.studentVisaRequestEntity.findMany({
      where: { studentId: isUserIsStudent ? session.userId : studentId },
      select,
    });
  }

  /**
   * Получение последней визовой анкеты студента.
   * @param select Поля, запрошенные через GraphQL.
   * @param session Текущая сессия.
   * @param studentId UUID Студента, если нужна визовая анкета конкретного студента, не старше visaRequestAgeLimit.
   * @param visaRequestId UUID Визовой анкеты, если нужна конкретная визовая анкета.
   * @returns Визовая анкета или null, если не найдена.
   * @throws {ForbiddenException} Студенты не могут читать чужие визовые анкеты.
   * @throws {NotFoundException} Визовая анкета по-указанному visaRequestId не найдена.
   * @throws {BadRequestException} Тип аккаунта не позволяет получить визовую анкету без studentId или visaRequestId.
   */
  @Query(() => StudentVisaRequestEntity, {
    description: 'Получение последней визовой анкеты',
    nullable: true,
  })
  @Roles(UserRoleEnum.Admin, UserRoleEnum.Employee, UserRoleEnum.Student)
  async visaRequest(
    @PrismaSelector() select: Prisma.StudentPassportEntitySelect,
    @CurrentSession() session: ISessionContext,
    @Args('studentId', { type: UUID, nullable: true }) studentId?: string,
    @Args('visaRequestId', { type: UUID, nullable: true }) visaRequestId?: string,
  ): Promise<PartialDeep<StudentVisaRequestEntity> | null> {
    const isUserIsStudent = isRoleStudent(session.roles);
    if (isUserIsStudent && studentId && studentId !== session.userId) {
      throw new ForbiddenException(ifDebug('Студенты не могут читать чужие визовые анкеты'));
    }
    if (!isUserIsStudent && !studentId && !visaRequestId) {
      throw new BadRequestException('Тип аккаунта не позволяет получить визовую анкету без studentId или visaRequestId');
    }
    const visaRequest = await this.prisma.studentVisaRequestEntity.findFirst({
      where: {
        studentId: isUserIsStudent ? session.userId : studentId,
        id: visaRequestId,
        createdAt: { gte: new Date(Date.now() - this.visaRequestAgeLimit) },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        ...select,
        studentId: true,
      },
    });
    if (visaRequestId && !visaRequest) {
      throw new NotFoundException(ifDebug('Визовая анкета по-указанному visaRequestId не найдена'));
    }
    if (isUserIsStudent && visaRequest && visaRequest.studentId !== session.userId) {
      throw new ForbiddenException(ifDebug('Студенты не могут читать чужие визовые анкеты'));
    }
    return visaRequest;
  }

  /**
   * Создание или обновление визовой анкеты.
   * Если не указаны studentId и visaRequestId, то будет использована анкета, не старше visaRequestAgeLimit.
   * Если таковая не найдена, то создаётся новая.
   * @param select Поля, запрошенные через GraphQL.
   * @param session Текущая сессия.
   * @param input Данные для создания или обновления визовой анкеты.
   * @param studentId UUID Студента, для которого перезаписывается визовая анкета.
   * @param visaRequestId UUID Визовой анкеты, которую нужно перезаписать.
   * @returns Визовая анкета.
   * @throws {ForbiddenException} Студенты не могут перезаписывать чужие визовые анкеты.
   * @throws {BadRequestException} Тип аккаунта не позволяет перезаписать визовую анкету без studentId или visaRequestId.
   */
  @Mutation(() => StudentVisaRequestEntity, {
    description: 'Перезапись визовой анкеты',
  })
  @Roles(UserRoleEnum.Admin, UserRoleEnum.Employee, UserRoleEnum.Student)
  async visaRequestUpsert(
    @PrismaSelector() select: Prisma.StudentPassportEntitySelect,
    @CurrentSession() session: ISessionContext,
    @Args('input') input: StudentVisaRequestUpsertInput,
    @Args('studentId', { type: UUID, nullable: true }) studentId?: string,
    @Args('visaRequestId', { type: UUID, nullable: true }) visaRequestId?: string,
  ): Promise<PartialDeep<StudentVisaRequestEntity>> {
    const isUserIsStudent = isRoleStudent(session.roles);
    const targetStudentId = studentId || session.userId;
    if (isUserIsStudent && studentId && studentId !== targetStudentId) {
      throw new ForbiddenException(ifDebug('Студенты не могут перезаписывать чужие визовые анкеты'));
    }
    if (!isUserIsStudent && targetStudentId === session.userId) {
      throw new BadRequestException('Тип аккаунта не позволяет перезаписывать визовую анкету без studentId или visaRequestId');
    }
    // Поиск визовой анкеты, которую нужно перезаписать
    const visaRequest = await this.prisma.studentVisaRequestEntity.findFirst({
      where: {
        studentId: targetStudentId,
        id: visaRequestId,
        createdAt: { gte: new Date(Date.now() - this.visaRequestAgeLimit) },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        studentId: true,
        id: true,
      },
    });
    if (visaRequest && visaRequest.studentId !== targetStudentId) {
      throw new ForbiddenException(ifDebug('Студенты не могут перезаписывать чужие визовые анкеты'));
    }
    if (visaRequest) {
      // Если анкета найдена, то обновляем её
      return this.prisma.studentVisaRequestEntity.update({
        where: { id: visaRequestId },
        data: input,
        select,
      });
    }
    // Если анкета не найдена, то создаём новую
    return this.prisma.studentVisaRequestEntity.create({
      data: {
        ...input,
        student: { connect: { id: targetStudentId } },
      },
      select,
    });
  }

  /**
   * Удаление визовых анкет.
   * @param select Поля, запрошенные через GraphQL.
   * @param session Текущая сессия.
   * @param studentId UUID Студента, для которого удаляется визовая анкета.
   * @param visaRequestId UUID Визовой анкеты, которую нужно удалить.
   * @returns Визовая анкета.
   * @throws {ForbiddenException} Студенты не могут удалять чужие визовые анкеты.
   * @throws {BadRequestException} Тип аккаунта не позволяет удалять визовую анкету без studentId или visaRequestId.
   * @throws {NotFoundException} Визовая анкета не найдена.
   */
  @Mutation(() => StudentVisaRequestEntity, {
    description: 'Удаление визовых анкет',
  })
  @Roles(UserRoleEnum.Admin, UserRoleEnum.Employee, UserRoleEnum.Student)
  async visaRequestDelete(
    @PrismaSelector() select: Prisma.StudentPassportEntitySelect,
    @CurrentSession() session: ISessionContext,
    @Args('studentId', { type: UUID, nullable: true }) studentId?: string,
    @Args('visaRequestId', { type: UUID, nullable: true }) visaRequestId?: string,
  ): Promise<PartialDeep<StudentVisaRequestEntity>> {
    const isUserIsStudent = isRoleStudent(session.roles);
    const targetStudentId = studentId || session.userId;
    if (isUserIsStudent && studentId && studentId !== targetStudentId) {
      throw new ForbiddenException(ifDebug('Студенты не могут удалять чужие визовые анкеты'));
    }
    if (!isUserIsStudent && targetStudentId === session.userId) {
      throw new BadRequestException('Тип аккаунта не позволяет удалять визовые анкеты без studentId или visaRequestId');
    }
    const visaRequest = await this.prisma.studentVisaRequestEntity.findFirstOrThrow({
      where: {
        studentId: targetStudentId,
        id: visaRequestId,
        createdAt: { gte: new Date(Date.now() - this.visaRequestAgeLimit) },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        studentId: true,
        id: true,
      },
    }).catch(throwCb(new NotFoundException('Визовая анкета не найдена')));
    if (visaRequest && visaRequest.studentId !== targetStudentId) {
      throw new ForbiddenException(ifDebug('Студенты не могут удалять чужие визовые анкеты'));
    }
    return this.prisma.studentVisaRequestEntity.delete({
      where: { id: visaRequest.id },
      select,
    });
  }

  @Mutation(() => String, {
    description: 'Экспорт документов',
  })
  @Roles(UserRoleEnum.Admin, UserRoleEnum.Employee, UserRoleEnum.Student)
  async exportDocuments(
    @PrismaSelector() select: Prisma.StudentPassportEntitySelect,
    @CurrentSession() session: ISessionContext,
    @Args('studentId', { type: UUID, nullable: true }) studentId?: string,
    @Args('visaRequestId', { type: UUID, nullable: true }) visaRequestId?: string,
  ): Promise<string> {
    // TODO: Implement
    console.log('exportDocuments', select, session, studentId, visaRequestId);
    throw new Error('Unimplemented');
  }
}