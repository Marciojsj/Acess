import { Router } from 'express';
import { AccessController } from '../controllers/AccessController';
import { authenticate } from '../middlewares/auth';
import { permit } from '../middlewares/permissions';

const router = Router();
const accessController = new AccessController();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Listar registros de acesso - Todos autenticados
router.get('/', (req, res) => accessController.findAll(req, res));

// Estatísticas de acesso - Todos autenticados
router.get('/stats', (req, res) => accessController.getStats(req, res));

// Buscar registro por ID - Todos autenticados
router.get('/:id', (req, res) => accessController.findById(req, res));

// Criar registro de acesso - OPERATOR, ADMIN, SUPERADMIN
router.post('/', permit('SUPERADMIN', 'ADMIN', 'OPERATOR'), (req, res) =>
  accessController.create(req, res)
);

// Gerar QR Code para visitante - ADMIN, SUPERADMIN
router.post('/qrcode/generate', permit('SUPERADMIN', 'ADMIN'), (req, res) =>
  accessController.generateVisitorQRCode(req, res)
);

// Validar QR Code - OPERATOR, ADMIN, SUPERADMIN
router.get('/qrcode/validate/:code', permit('SUPERADMIN', 'ADMIN', 'OPERATOR'), (req, res) =>
  accessController.validateQRCode(req, res)
);

// Usar QR Code (registra entrada) - OPERATOR, ADMIN, SUPERADMIN
router.post('/qrcode/use/:code', permit('SUPERADMIN', 'ADMIN', 'OPERATOR'), (req, res) =>
  accessController.useQRCode(req, res)
);

export default router;
