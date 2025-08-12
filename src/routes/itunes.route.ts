import { Router } from 'express';
import { getITunesApps } from '../controller/itunes.controller';
import { Register, Login} from '../controller/auth.controller'

const router = Router();

router.get('/itunes/search', getITunesApps);
router.post('/register', Register);
router.post('/login', Login);

export default router;
