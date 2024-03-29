import { Context } from 'telegraf';

/**
 * Контекст Telegraf бота приложения.
 */
export class TelegrafBotContext extends Context {
  /**
   * Полезная нагрузка для команды /start.
   */
  public startPayload?: string;

  /**
   * Текущее состояние.
   */
  public state: {
    /**
     * Идентификатор пользователя во внутренней системе.
     */
    userId?: string;
  };
}
