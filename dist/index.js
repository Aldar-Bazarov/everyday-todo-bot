"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = require("dotenv");
const bot_1 = require("./bot");
// Загрузка переменных окружения из файла .env
(0, dotenv_1.config)();
// Получение токена из переменных окружения
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error('Не удалось загрузить токен бота. Убедитесь, что переменные окружения настроены правильно.');
    process.exit(1);
}
// Создание экземпляра бота
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
// Запуск бота
(0, bot_1.startBot)(bot);
