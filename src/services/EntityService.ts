import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

interface CreateEntityData {
  name: string;
  type: string;
  address?: string;
  phone?: string;
  email?: string;
  maxUsers?: number;
}

interface UpdateEntityData {
  name?: string;
  type?: string;
  address?: string;
  phone?: string;
  email?: string;
  maxUsers?: number;
  isActive?: boolean;
}

export class EntityService {
  async findAll() {
    const entities = await prisma.entity.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return entities;
  }

  async findById(id: string) {
    const entity = await prisma.entity.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (!entity) {
      throw new AppError('Entidade não encontrada', 404);
    }

    return entity;
  }

  async create(data: CreateEntityData) {
    const { name, type, address, phone, email, maxUsers } = data;

    if (!name || !type) {
      throw new AppError('Nome e tipo são obrigatórios', 400);
    }

    const validTypes = ['SCHOOL', 'CONDOMINIUM', 'COMPANY', 'EVENT'];
    if (!validTypes.includes(type)) {
      throw new AppError('Tipo de entidade inválido', 400);
    }

    const entity = await prisma.entity.create({
      data: {
        name,
        type: type as any,
        address,
        phone,
        email,
        maxUsers: maxUsers || 100,
      },
    });

    return entity;
  }

  async update(id: string, data: UpdateEntityData) {
    const entity = await prisma.entity.findUnique({ where: { id } });

    if (!entity) {
      throw new AppError('Entidade não encontrada', 404);
    }

    if (data.type) {
      const validTypes = ['SCHOOL', 'CONDOMINIUM', 'COMPANY', 'EVENT'];
      if (!validTypes.includes(data.type)) {
        throw new AppError('Tipo de entidade inválido', 400);
      }
    }

    const updateData: any = { ...data };
    if (updateData.type) {
      updateData.type = updateData.type as any;
    }

    const updatedEntity = await prisma.entity.update({
      where: { id },
      data: updateData,
    });

    return updatedEntity;
  }

  async delete(id: string) {
    const entity = await prisma.entity.findUnique({ where: { id } });

    if (!entity) {
      throw new AppError('Entidade não encontrada', 404);
    }

    // Verificar se há usuários vinculados
    const usersCount = await prisma.user.count({
      where: { entityId: id },
    });

    if (usersCount > 0) {
      throw new AppError(
        'Não é possível deletar entidade com usuários vinculados',
        400
      );
    }

    await prisma.entity.delete({ where: { id } });

    return { message: 'Entidade deletada com sucesso' };
  }
}
