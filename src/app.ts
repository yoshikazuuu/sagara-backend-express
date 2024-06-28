import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import config from './configs/config';
import logger from './utils/logger.util';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import Container from 'typedi';

import { LoggerMiddleware } from './middlewares/logger.middleware';
import { useExpressServer, useContainer } from 'routing-controllers';
import { AuthController } from './controllers/auth.controller';
import { ErrorMiddleware } from './middlewares/error.middleware';

useContainer(Container);

const port = process.env.PORT ?? 5000;
const app = express();

// global middlewares
app.use(compression());
app.use(helmet());
app.use(cors(config.cors));
app.use(cookieParser());
app.use(express.json());

// routing-controllers
useExpressServer(app, {
    controllers: [AuthController],
    middlewares: [LoggerMiddleware, ErrorMiddleware],
    defaultErrorHandler: false,
    cors: config.cors,
    development: config.isDev,
    validation: {
        forbidUnknownValues: true,
        stopAtFirstError: true,
    },
});


app.listen(port, async () => {
    logger.info(`Server is hosted at http://localhost:${port}/`);
});