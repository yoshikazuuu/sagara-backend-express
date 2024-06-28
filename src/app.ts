import cors from 'cors';
import helmet from 'helmet';
import express, { Request } from 'express';
import config from './configs/config';
import logger from './utils/logger.util';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import Container from 'typedi';

import { LoggerMiddleware } from './middlewares/logger.middleware';
import { useExpressServer, useContainer } from 'routing-controllers';
import { AuthController } from './controllers/auth.controller';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { TaskController } from 'controllers/task.controller';
import { AuthService } from 'services/auth.service';
import { Errors } from 'utils/api.util';

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
    controllers: [AuthController, TaskController],
    middlewares: [LoggerMiddleware, ErrorMiddleware],
    defaultErrorHandler: false,
    cors: config.cors,
    development: config.isDev,
    validation: {
        forbidUnknownValues: true,
        stopAtFirstError: true,
    },
    currentUserChecker: async (action) => {
        const req = action.request as Request;
        const service = Container.get(AuthService);

        const payload = await service.getUserPayload(req);
        if (!payload) {
            throw Errors.NO_SESSION;
        }

        return payload;
    },
});


app.listen(port, async () => {
    logger.info(`Server is hosted at http://localhost:${port}/`);
});