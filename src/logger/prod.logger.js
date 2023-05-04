import winston from "winston";
import customLeveloptions from "./customLevelOptions.logger.js";

const logger = winston.createLogger({
    levels: customLeveloptions.levels,
    transports: [new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
            winston.format.colorize({colors: customLeveloptions.colors}),
            winston.format.simple()
        )    
    }),
    new winston.transports.File({
        filename: './logs/errors.log',
        level: 'error',
        format: winston.format.simple()
    })
    ]
});

export default logger;