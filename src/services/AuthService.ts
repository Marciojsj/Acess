import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../middlewares/errorHandler';

const prisma = new PrismaClient();

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
  entityId?: string;
  phone?: string;
  document?: string;
}

export class AuthService {
  async login(data: LoginData) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { entity: true },
    });

    if (!user) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    if (!user.isActive) {
      throw new AppError('Usuário inativo', 403);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Email ou senha inválidos', 401);
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        entityId: user.entityId ?? undefined,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' }
    );

    // Salvar refresh token no banco
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        entityId: user.entityId,
        entity: user.entity,
      },
    };
  }

  async register(data: RegisterData) {
    const { name, email, password, role, entityId, phone, document } = data;

    // Validações
    if (!name || !email || !password) {
      throw new AppError('Nome, email e senha são obrigatórios', 400);
    }

    if (password.length < 8) {
      throw new AppError('Senha deve ter no mínimo 8 caracteres', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Email inválido', 400);
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email já cadastrado', 409);
    }

    // Verificar se documento já existe (se fornecido)
    if (document) {
      const existingDocument = await prisma.user.findUnique({
        where: { document },
      });

      if (existingDocument) {
        throw new AppError('Documento já cadastrado', 409);
      }
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
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
    };
  }

  async refreshToken(token: string) {
    try {
      jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET!
      ) as { id: string };

      // Verificar se token existe no banco e não expirou
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!storedToken) {
        throw new AppError('Token inválido', 401);
      }

      if (storedToken.expiresAt < new Date()) {
        await prisma.refreshToken.delete({ where: { token } });
        throw new AppError('Token expirado', 401);
      }

      const user = storedToken.user;

      if (!user.isActive) {
        throw new AppError('Usuário inativo', 403);
      }

      // Gerar novo access token
      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          entityId: user.entityId ?? undefined,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
      );

      return { accessToken };
    } catch (error) {
      throw new AppError('Token inválido', 401);
    }
  }

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });

    return { message: 'Logout realizado com sucesso' };
  }
}
