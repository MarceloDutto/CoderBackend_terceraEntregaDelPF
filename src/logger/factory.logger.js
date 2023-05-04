import config from "../config/index.js";
import devLogger from "./dev.logger.js";
import prodLogger from "./prod.logger.js";

const { environment } = config.app;
let logger;

switch (environment) {
    case 'development':
        console.log('devLog');
        logger = devLogger;
        break;
    case 'production':
        console.log('prodLog');
        logger = prodLogger;
        break;
};

export default logger;