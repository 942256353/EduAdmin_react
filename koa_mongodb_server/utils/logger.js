const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

// 获取当前文件所在的目录
const currentDir = path.dirname(__filename);

// 定义日志文件夹的路径
const logDir = path.join(currentDir, '..', 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const loggers = {};

const myFormat = format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
});


const getLogger = (moduleName) => {
  if (!loggers[moduleName]) {
    loggers[moduleName] = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: path.join(logDir, `${moduleName}.log`), level: 'info' })
      ]
    });
  }
  return loggers[moduleName];
};

const logToCustomFile = (level, message='message', moduleName="log") => {
  const lgr = getLogger(moduleName);
  lgr.log(level, message);
};

/**
* @param {string} message 日志信息
* @param {string} moduleName 指定日志文件，没有将会创建,不传指定到log.log
*/
const logger = {
    info: (message,moduleName) => {
        logToCustomFile('info', message,moduleName);
    },
    error: (message,moduleName) => {
        logToCustomFile('error', message,moduleName);
    },
    warn: (message,moduleName) => {
        logToCustomFile('warn', message,moduleName);
    },
    debug: (message,moduleName) => {    
        logToCustomFile('debug', message,moduleName);
    }
}   

module.exports = logger;