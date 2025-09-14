import '../module-alias';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import compression from 'compression';
import adminRoutes from './modules/admin/admin.routes';
import appRoutes from './modules/app/app.routes';

import 'module-alias/register';

const app = express();
const PORT = process.env.PORT || 9000;

const main = async (): Promise<void> => {
  app.use(cors());
  app.use(compression());

  app.get('/', async (req, res) => {
    res.send('404 Not Found');
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/admin', adminRoutes);
  app.use('/app', appRoutes);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.info(`Server is running on PORT ${PORT}`);
  });
};

main();
