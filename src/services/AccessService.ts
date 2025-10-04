import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import QRCode from 'qrcode';
import crypto from 'crypto';

const prisma = new PrismaClient();

interface CreateAccessLogData {
  userId?: string;
  entityId?: string;
  visitorName?: string;
  visitorDoc?: string;
  visitorPhone?: string;
  type: string;
  status?: string;
  method?: string;
  notes?: string;
  operatorId: string;
  qrCode?: string;
}

interface AccessFilters {
  entityId?: string;
  userId?: string;
  type?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export class AccessService {
  async findAll(filters: AccessFilters) {
    const where: any = {};

    if (filters.entityId) where.entityId = filters.entityId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;

    if (filters.startDate || filters.endDate) {
      where.timestamp = {};
      if (filters.startDate) where.timestamp.gte = filters.startDate;
      if (filters.endDate) where.timestamp.lte = filters.endDate;
    }

    const accessLogs = await prisma.accessLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        entity: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        operator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    return accessLogs;
  }

  async findById(id: string) {
    const accessLog = await prisma.accessLog.findUnique({
      where: { id },
      include: {
        user: true,
        entity: true,
        operator: true,
      },
    });

    if (!accessLog) {
      throw new AppError('Registro de acesso não encontrado', 404);
    }

    return accessLog;
  }

  async create(data: CreateAccessLogData) {
    const { userId, entityId, type, status, method, notes, operatorId, visitorName, visitorDoc, visitorPhone, qrCode } = data;

    if (!type) {
      throw new AppError('Tipo de acesso é obrigatório', 400);
    }

    const validTypes = ['ENTRY', 'EXIT'];
    if (!validTypes.includes(type)) {
      throw new AppError('Tipo de acesso inválido', 400);
    }

    // Se não for visitante, userId é obrigatório
    if (!userId && !visitorName) {
      throw new AppError('Usuário ou nome do visitante é obrigatório', 400);
    }

    const accessLog = await prisma.accessLog.create({
      data: {
        userId: userId ?? undefined,
        entityId: entityId ?? undefined,
        visitorName: visitorName ?? undefined,
        visitorDoc: visitorDoc ?? undefined,
        visitorPhone: visitorPhone ?? undefined,
        type: type as any,
        status: status as any || 'AUTHORIZED',
        method: method || 'MANUAL',
        notes: notes ?? undefined,
        operatorId,
        qrCode: qrCode ?? undefined,
      },
      include: {
        user: true,
        entity: true,
        operator: true,
      },
    });

    return accessLog;
  }

  async generateVisitorQRCode(data: {
    visitorName: string;
    visitorDoc?: string;
    visitorPhone?: string;
    entityId?: string;
    createdBy: string;
    validHours?: number;
  }) {
    const { visitorName, visitorDoc, visitorPhone, entityId, createdBy, validHours = 24 } = data;

    if (!visitorName) {
      throw new AppError('Nome do visitante é obrigatório', 400);
    }

    // Gerar código único
    const code = crypto.randomBytes(16).toString('hex');

    // Calcular validade
    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + validHours);

    // Salvar no banco
    const qrCodeRecord = await prisma.visitorQRCode.create({
      data: {
        code,
        visitorName,
        visitorDoc,
        visitorPhone,
        entityId,
        validUntil,
        createdBy,
      },
    });

    // Gerar QR code como imagem (base64)
    const qrCodeData = JSON.stringify({
      code,
      visitorName,
      validUntil,
    });

    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    return {
      id: qrCodeRecord.id,
      code: qrCodeRecord.code,
      visitorName: qrCodeRecord.visitorName,
      validUntil: qrCodeRecord.validUntil,
      qrCodeImage,
    };
  }

  async validateVisitorQRCode(code: string) {
    const qrCodeRecord = await prisma.visitorQRCode.findUnique({
      where: { code },
    });

    if (!qrCodeRecord) {
      throw new AppError('QR Code inválido', 404);
    }

    if (qrCodeRecord.used) {
      throw new AppError('QR Code já utilizado', 400);
    }

    if (qrCodeRecord.validUntil < new Date()) {
      throw new AppError('QR Code expirado', 400);
    }

    return qrCodeRecord;
  }

  async useVisitorQRCode(code: string, operatorId: string) {
    const qrCodeRecord = await this.validateVisitorQRCode(code);

    // Marcar como usado
    await prisma.visitorQRCode.update({
      where: { code },
      data: { used: true },
    });

    // Criar registro de acesso
    const accessLog = await this.create({
      visitorName: qrCodeRecord.visitorName,
      visitorDoc: qrCodeRecord.visitorDoc ?? undefined,
      visitorPhone: qrCodeRecord.visitorPhone ?? undefined,
      entityId: qrCodeRecord.entityId ?? undefined,
      type: 'ENTRY',
      status: 'AUTHORIZED',
      method: 'QR_CODE',
      operatorId,
      qrCode: code,
    });

    return accessLog;
  }

  async getStats(entityId?: string) {
    const where = entityId ? { entityId } : {};

    const total = await prisma.accessLog.count({ where });
    const entries = await prisma.accessLog.count({
      where: { ...where, type: 'ENTRY' },
    });
    const exits = await prisma.accessLog.count({
      where: { ...where, type: 'EXIT' },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTotal = await prisma.accessLog.count({
      where: {
        ...where,
        timestamp: { gte: today },
      },
    });

    return {
      total,
      entries,
      exits,
      today: todayTotal,
    };
  }
}
