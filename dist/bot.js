"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBot = startBot;
const tasks_1 = require("./tasks");
const scheduler_1 = require("./scheduler");
const userStates = {};
function startBot(bot) {
    let isPolling = true;
    // Установка команд бота
    bot.setMyCommands([
        { command: '/start', description: 'Список комманд' }
        // { command: '/stop', description: 'Остановить бота' }
    ]);
    const taskKeyboard = {
        reply_markup: {
            keyboard: [
                [{ text: 'Список задач 📋' }],
                [{ text: 'Добавить задачу ✅' }, { text: 'Удалить задачу 🗑️' }],
                [{ text: 'Включить уведомления 🔔' }, { text: 'Выключить уведомления 🔕' }]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
    };
    // Команда /start
    bot.onText(/\/start/, (msg) => {
        if (!isPolling) {
            bot.startPolling();
            isPolling = true;
        }
        bot.sendMessage(msg.chat.id, 'Бот запущен', taskKeyboard);
    });
    // Обработка нажатий на кнопки
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        if (!userStates[chatId]) {
            userStates[chatId] = { addingTask: false, deletingTask: false };
        }
        if (msg.text === 'Список задач 📋') {
            (0, tasks_1.handleGetTasks)(bot, chatId, taskKeyboard);
        }
        else if (msg.text === 'Добавить задачу ✅') {
            userStates[chatId].addingTask = true;
            bot.sendMessage(chatId, 'Введите описание задачи:', taskKeyboard);
        }
        else if (msg.text === 'Удалить задачу 🗑️') {
            userStates[chatId].deletingTask = true;
            bot.sendMessage(chatId, 'Введите номер задачи для удаления:', taskKeyboard);
        }
        else if (msg.text === '/stop') {
            (0, tasks_1.handleStopBot)(bot, chatId, taskKeyboard);
        }
        else if (msg.text === 'Включить уведомления 🔔') {
            (0, scheduler_1.startScheduler)(bot, taskKeyboard);
        }
        else if (msg.text === 'Выключить уведомления 🔕') {
            (0, scheduler_1.stopScheduler)();
            bot.sendMessage(chatId, 'Уведомления выключены', taskKeyboard);
        }
        else if (userStates[chatId].addingTask) {
            if (msg.text) {
                (0, tasks_1.handleAddTask)(bot, chatId, msg.text, taskKeyboard);
                userStates[chatId].addingTask = false;
            }
            else {
                bot.sendMessage(chatId, 'Описание задачи не может быть пустым. Пожалуйста, введите описание задачи.', taskKeyboard);
            }
        }
        else if (userStates[chatId].deletingTask && msg.text) {
            const taskId = parseInt(msg.text);
            if (!isNaN(taskId)) {
                (0, tasks_1.handleDeleteTask)(bot, chatId, taskId, taskKeyboard);
                userStates[chatId].deletingTask = false;
            }
            else {
                bot.sendMessage(chatId, 'Номер задачи должен быть числом. Пожалуйста, введите корректный номер задачи для удаления.', taskKeyboard);
            }
        }
    });
}
