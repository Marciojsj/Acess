import { Router } from 'express';
import { EntityController } from '../controllers/EntityController';
import { authenticate } from '../middlewares/auth';
import { permit } from '../middlewares/permissions';

const router = Router();
const entityController = new EntityController();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Listar entidades - SUPERADMIN, ADMIN
router.get('/', permit('SUPERADMIN', 'ADMIN'), (req, res) =>
  entityController.findAll(req, res)
);

// Buscar entidade por ID - SUPERADMIN, ADMIN
router.get('/:id', permit('SUPERADMIN', 'ADMIN'), (req, res) =>
  entityController.findById(req, res)
);

// Criar entidade - SUPERADMIN
router.post('/', permit('SUPERADMIN'), (req, res) =>
  entityController.create(req, res)
);

// Atualizar entidade - SUPERADMIN
router.put('/:id', permit('SUPERADMIN'), (req, res) =>
  entityController.update(req, res)
);

// Deletar entidade - SUPERADMIN
router.delete('/:id', permit('SUPERADMIN'), (req, res) =>
  entityController.delete(req, res)
);

export default router;
