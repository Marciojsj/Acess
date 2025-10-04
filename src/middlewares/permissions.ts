import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const permit = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    if (!user.role) {
      return res.status(403).json({ message: 'Sem permissão definida' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        message: 'Acesso negado. Você não tem permissão para esta ação.' 
      });
    }

    return next();
  };
};

// Verificar se usuário pertence à mesma entidade ou é SUPERADMIN
export const sameEntityOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  const targetEntityId = req.params.entityId || req.body.entityId;

  if (!user) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  // SUPERADMIN tem acesso total
  if (user.role === 'SUPERADMIN') {
    return next();
  }

  // ADMIN só pode acessar sua própria entidade
  if (user.role === 'ADMIN' && user.entityId !== targetEntityId) {
    return res.status(403).json({ 
      message: 'Você só pode acessar dados da sua entidade' 
    });
  }

  return next();
};
