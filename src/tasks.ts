import TelegramBot from 'node-telegram-bot-api'
import client from './db'

// Команда для получения списка задач
export async function handleGetTasks(
  bot: TelegramBot,
  chatId: number,
  keyboard: any
): Promise<void> {
  const res = await client.query('SELECT * FROM tasks')
  const tasks = res.rows.map((task) => `${task.id}: ${task.description}`).join('\n')
  bot.sendMessage(chatId, tasks || 'Задач нет', keyboard)
}

// Функция для добавления задачи
export async function handleAddTask(
  bot: TelegramBot,
  chatId: number,
  description: string,
  keyboard: any
): Promise<void> {
  await client.query('INSERT INTO tasks (description) VALUES ($1)', [description])
  bot.sendMessage(chatId, 'Задача добавлена', keyboard)
}

// Функция для удаления задачи
export async function handleDeleteTask(
  bot: TelegramBot,
  chatId: number,
  taskId: number,
  keyboard: any
): Promise<void> {
  const res = await client.query('DELETE FROM tasks WHERE id = $1', [taskId])
  if (res.rowCount && res.rowCount > 0) {
    bot.sendMessage(chatId, 'Задача удалена', keyboard)
  } else {
    bot.sendMessage(chatId, 'Не удалось найти задачу с указанным номером.', keyboard)
  }
}

// Функция для остановки бота
export function handleStopBot(bot: TelegramBot, chatId: number, keyboard: any): void {
  bot.stopPolling()
  bot.sendMessage(chatId, 'Бот остановлен', keyboard)
}
