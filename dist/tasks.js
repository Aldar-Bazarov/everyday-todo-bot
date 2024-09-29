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
exports.handleGetTasks = handleGetTasks;
exports.handleAddTask = handleAddTask;
exports.handleDeleteTask = handleDeleteTask;
exports.handleStopBot = handleStopBot;
const db_1 = __importDefault(require("./db"));
// Команда для получения списка задач
function handleGetTasks(bot, chatId, keyboard) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield db_1.default.query('SELECT * FROM tasks');
        const tasks = res.rows.map((task) => `${task.id}: ${task.description}`).join('\n');
        bot.sendMessage(chatId, tasks || 'Задач нет', keyboard);
    });
}
// Функция для добавления задачи
function handleAddTask(bot, chatId, description, keyboard) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.default.query('INSERT INTO tasks (description) VALUES ($1)', [description]);
        bot.sendMessage(chatId, 'Задача добавлена', keyboard);
    });
}
// Функция для удаления задачи
function handleDeleteTask(bot, chatId, taskId, keyboard) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield db_1.default.query('DELETE FROM tasks WHERE id = $1', [taskId]);
        if (res.rowCount && res.rowCount > 0) {
            bot.sendMessage(chatId, 'Задача удалена', keyboard);
        }
        else {
            bot.sendMessage(chatId, 'Не удалось найти задачу с указанным номером.', keyboard);
        }
    });
}
// Функция для остановки бота
function handleStopBot(bot, chatId, keyboard) {
    bot.stopPolling();
    bot.sendMessage(chatId, 'Бот остановлен', keyboard);
}
