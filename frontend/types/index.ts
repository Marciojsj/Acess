// ==============================================
// ENUMS (copiados do backend Prisma)
// ==============================================

export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  USER = 'USER',
  VISITOR = 'VISITOR',
}

export enum EntityType {
  SCHOOL = 'SCHOOL',
  CONDOMINIUM = 'CONDOMINIUM',
  COMPANY = 'COMPANY',
  EVENT = 'EVENT',
}

export enum AccessType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
}

export enum AccessStatus {
  AUTHORIZED = 'AUTHORIZED',
  DENIED = 'DENIED',
  PENDING = 'PENDING',
}

// ==============================================
// MODELS
// ==============================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  entityId?: string;
  entity?: Entity;
  phone?: string;
  document?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  maxUsers: number;
  createdAt: string;
  updatedAt: string;
}

export interface AccessLog {
  id: string;
  userId?: string;
  user?: User;
  entityId?: string;
  entity?: Entity;
  visitorName?: string;
  visitorDoc?: string;
  visitorPhone?: string;
  type: AccessType;
  status: AccessStatus;
  method?: string;
  notes?: string;
  operatorId: string;
  operator?: User;
  timestamp: string;
  qrCode?: string;
}

export interface VisitorQRCode {
  id: string;
  code: string;
  visitorName: string;
  visitorDoc?: string;
  visitorPhone?: string;
  entityId?: string;
  validUntil: string;
  used: boolean;
  createdBy: string;
  createdAt: string;
  qrCodeImage?: string;
}

// ==============================================
// AUTH
// ==============================================

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: Role;
  entityId?: string;
  phone?: string;
  document?: string;
}

// ==============================================
// STATS
// ==============================================

export interface AccessStats {
  total: number;
  entries: number;
  exits: number;
  today: number;
}

// ==============================================
// FILTERS
// ==============================================

export interface AccessFilters {
  entityId?: string;
  userId?: string;
  type?: AccessType;
  status?: AccessStatus;
  startDate?: string;
  endDate?: string;
}
