"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = startScheduler;
exports.stopScheduler = stopScheduler;
const node_cron_1 = require("node-cron");
const db_1 = __importDefault(require("./db"));
const dotenv_1 = require("dotenv");
// Загрузка переменных окружения из файла .env
(0, dotenv_1.config)();
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
let scheduledTask = null;
// Периодическая отправка списка задач
function startScheduler(bot, taskKeyboard) {
    if (TELEGRAM_CHAT_ID) {
        if (scheduledTask == null) {
            bot.sendMessage(TELEGRAM_CHAT_ID, 'Уведомления включены', taskKeyboard);
            scheduledTask = (0, node_cron_1.schedule)('0 9,12,15,18,21 * * *', () => __awaiter(this, void 0, void 0, function* () {
                const res = yield db_1.default.query('SELECT * FROM tasks');
                const tasks = res.rows.map((task) => `${task.id}: ${task.description}`).join('\n');
                bot.sendMessage(TELEGRAM_CHAT_ID, tasks || 'Нет активных задач');
            }));
        }
        else {
            bot.sendMessage(TELEGRAM_CHAT_ID, 'Уведолмения уже включены', taskKeyboard);
        }
    }
}
// Остановка шедулера
function stopScheduler() {
    if (scheduledTask) {
        scheduledTask.stop();
        scheduledTask = null;
    }
}
