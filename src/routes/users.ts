import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middlewares/auth';
import { permit } from '../middlewares/permissions';

const router = Router();
const userController = new UserController();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Listar usuários - SUPERADMIN, ADMIN
router.get('/', permit('SUPERADMIN', 'ADMIN'), (req, res) =>
  userController.findAll(req, res)
);

// Buscar usuário por ID - SUPERADMIN, ADMIN
router.get('/:id', permit('SUPERADMIN', 'ADMIN'), (req, res) =>
  userController.findById(req, res)
);

// Criar usuário - SUPERADMIN, ADMIN
router.post('/', permit('SUPERADMIN', 'ADMIN'), (req, res) =>
  userController.create(req, res)
);

// Atualizar usuário - SUPERADMIN, ADMIN
router.put('/:id', permit('SUPERADMIN', 'ADMIN'), (req, res) =>
  userController.update(req, res)
);

// Deletar usuário - SUPERADMIN
router.delete('/:id', permit('SUPERADMIN'), (req, res) =>
  userController.delete(req, res)
);

export default router;
