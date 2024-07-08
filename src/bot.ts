import TelegramBot, { Message } from 'node-telegram-bot-api'
import { handleGetTasks, handleAddTask, handleDeleteTask, handleStopBot } from './tasks'
import { startScheduler, stopScheduler } from './scheduler'

interface UserState {
  addingTask: boolean
  deletingTask: boolean
}

const userStates: { [key: number]: UserState } = {}

export function startBot(bot: TelegramBot): void {
  let isPolling = true

  // Установка команд бота
  bot.setMyCommands([
    { command: '/start', description: 'Список комманд' }
    // { command: '/stop', description: 'Остановить бота' }
  ])

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
  }

  // Команда /start
  bot.onText(/\/start/, (msg: Message) => {
    if (!isPolling) {
      bot.startPolling()
      isPolling = true
    }
    bot.sendMessage(msg.chat.id, 'Бот запущен', taskKeyboard)
  })

  // Обработка нажатий на кнопки
  bot.on('message', (msg: Message) => {
    const chatId = msg.chat.id

    if (!userStates[chatId]) {
      userStates[chatId] = { addingTask: false, deletingTask: false }
    }

    if (msg.text === 'Список задач 📋') {
      handleGetTasks(bot, chatId, taskKeyboard)
    } else if (msg.text === 'Добавить задачу ✅') {
      userStates[chatId].addingTask = true
      bot.sendMessage(chatId, 'Введите описание задачи:', taskKeyboard)
    } else if (msg.text === 'Удалить задачу 🗑️') {
      userStates[chatId].deletingTask = true
      bot.sendMessage(chatId, 'Введите номер задачи для удаления:', taskKeyboard)
    } else if (msg.text === '/stop') {
      handleStopBot(bot, chatId, taskKeyboard)
    } else if (msg.text === 'Включить уведомления 🔔') {
      startScheduler(bot, taskKeyboard)
    } else if (msg.text === 'Выключить уведомления 🔕') {
      stopScheduler()
      bot.sendMessage(chatId, 'Уведомления выключены', taskKeyboard)
    } else if (userStates[chatId].addingTask) {
      if (msg.text) {
        handleAddTask(bot, chatId, msg.text, taskKeyboard)
        userStates[chatId].addingTask = false
      } else {
        bot.sendMessage(
          chatId,
          'Описание задачи не может быть пустым. Пожалуйста, введите описание задачи.',
          taskKeyboard
        )
      }
    } else if (userStates[chatId].deletingTask && msg.text) {
      const taskId = parseInt(msg.text)
      if (!isNaN(taskId)) {
        handleDeleteTask(bot, chatId, taskId, taskKeyboard)
        userStates[chatId].deletingTask = false
      } else {
        bot.sendMessage(
          chatId,
          'Номер задачи должен быть числом. Пожалуйста, введите корректный номер задачи для удаления.',
          taskKeyboard
        )
      }
    }
  })
}
