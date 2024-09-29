"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const pg_1 = require("pg");
// Загрузка переменных окружения из файла .env
(0, dotenv_1.config)();
// Подключение к PostgreSQL
const client = new pg_1.Client({
    connectionString: process.env.BD_CONNECTION_STRING
});
client.connect();
exports.default = client;
