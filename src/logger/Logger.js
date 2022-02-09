import pkg from 'winston';
import { Mail } from 'winston-mail';

const { createLogger, transports, format } = pkg;

const logger = (orderId = '') => {
    if (orderId) {
        return createLogger({
            transports: [
                new transports.File({
                    filename: `logs/orders/${orderId}.log`,
                    level: 'info',
                    format: format.combine(format.timestamp(), format.simple())
                })
            ]
        });
    }
    return createLogger({
        transports: [
            new transports.File({
                filename: 'logs/general.log',
                level: 'info',
                format: format.combine(format.timestamp(), format.simple())
            })
        ]
    });
};

export const mailLogger = createLogger({
    transports: [
        new transports.Mail({
            to: 'selinamiddleware@gmail.com',
            from: 'selinamiddleware@gmail.com',
            subject: 'Error al facturar orden',
            host: 'smtp.gmail.com',
            username: 'selinamiddleware@gmail.com',
            password: 'SelinaFacturas2021',
            ssl: true
        })
    ]
});

export default logger