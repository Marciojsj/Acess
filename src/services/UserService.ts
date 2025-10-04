import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
  entityId?: string;
  phone?: string;
  document?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  entityId?: string;
  phone?: string;
  document?: string;
  isActive?: boolean;
}

export class UserService {
  async findAll(entityId?: string) {
    const where = entityId ? { entityId } : {};

    const users = await prisma.user.findMany({
      where,
      include: { entity: true },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      entityId: user.entityId,
      entity: user.entity,
      phone: user.phone,
      document: user.document,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }));
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { entity: true },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      entityId: user.entityId,
      entity: user.entity,
      phone: user.phone,
      document: user.document,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  async create(data: CreateUserData) {
    const { name, email, password, role, entityId, phone, document } = data;

    // Validações
    if (!name || !email || !password) {
      throw new AppError('Nome, email e senha são obrigatórios', 400);
    }

    if (password.length < 8) {
      throw new AppError('Senha deve ter no mínimo 8 caracteres', 400);
    }

    // Verificar email único
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new AppError('Email já cadastrado', 409);
    }

    // Verificar documento único
    if (document) {
      const existingDocument = await prisma.user.findUnique({
        where: { document },
      });

      if (existingDocument) {
        throw new AppError('Documento já cadastrado', 409);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as any || 'USER',
        entityId,
        phone,
        document,
      },
      include: { entity: true },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      entityId: user.entityId,
      entity: user.entity,
      phone: user.phone,
      document: user.document,
      isActive: user.isActive,
    };
  }

  async update(id: string, data: UpdateUserData) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Validar email único (se estiver sendo alterado)
    if (data.email && data.email !== user.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingEmail) {
        throw new AppError('Email já cadastrado', 409);
      }
    }

    // Validar documento único (se estiver sendo alterado)
    if (data.document && data.document !== user.document) {
      const existingDocument = await prisma.user.findUnique({
        where: { document: data.document },
      });

      if (existingDocument) {
        throw new AppError('Documento já cadastrado', 409);
      }
    }

    // Hash da senha se fornecida
    let updateData: any = { ...data };
    if (data.password) {
      if (data.password.length < 8) {
        throw new AppError('Senha deve ter no mínimo 8 caracteres', 400);
      }
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { entity: true },
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      entityId: updatedUser.entityId,
      entity: updatedUser.entity,
      phone: updatedUser.phone,
      document: updatedUser.document,
      isActive: updatedUser.isActive,
    };
  }

  async delete(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    await prisma.user.delete({ where: { id } });

    return { message: 'Usuário deletado com sucesso' };
  }
}
