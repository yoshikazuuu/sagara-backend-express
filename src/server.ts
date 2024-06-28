import app from "./app";
import logger from "./utils/logger.util";

const port = process.env.PORT ?? 5000;

app.listen(port, async () => {
    logger.info(`Server is hosted at http://localhost:${port}/`);
});