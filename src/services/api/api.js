/**
 * Конфигурация API
 * @typedef {Object} Config
 * @property {string} baseUrl - Базовый URL API
 * @property {string} authorization - Токен авторизации
 */

/**
 * @type {Config}
 */
const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-38",
  headers: {
    authorization: "33c061d5-f313-4f1b-840d-16309eab437d",
    "Content-Type": "application/json"
  }
};

/**
 * Пути к API
 */
const urlPaths = {
  me: `${config.baseUrl}/users/me`,
  meAvatar: `${config.baseUrl}/users/me/avatar`,
  cards: `${config.baseUrl}/cards`,
  card: (id) => `${config.baseUrl}/cards/${id}`,
  cardLike: (id) => `${config.baseUrl}/cards/likes/${id}`,
};

/**
 * Функция для отправки запросов API.
 * @param {string} url - URL запроса
 * @param {Object} options - Дополнительные параметры запроса (метод, тело и т.д.)
 * @returns {Promise<Object>} Ответ от сервера в формате JSON
 */
const apiProvider = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...config.headers,
        ...options.headers,
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Ошибка ${response.status}: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Методы для работы с профилем пользователя
 */
const profileApi = {
  /**
   * Получение данных профиля
   * @returns {Promise<Object>} Ответ от сервера с данными профиля
   */
  getProfile: () => apiProvider(urlPaths.me, { method: "GET" }),

  /**
   * Обновление данных профиля
   * @param {string} name - Имя пользователя
   * @param {string} about - Описание пользователя
   * @returns {Promise<Object>} Ответ от сервера с обновленными данными профиля
   */
  updateProfile: (name, about) =>
    apiProvider(urlPaths.me, {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    }),

  /**
   * Обновление аватара пользователя
   * @param {string} avatar - URL аватара
   * @returns {Promise<Object>} Ответ от сервера с обновленным аватаром
   */
  updateAvatar: (avatar) =>
    apiProvider(urlPaths.meAvatar, {
      method: "PATCH",
      body: JSON.stringify({ avatar }),
    }),
};

/**
 * Методы для работы с карточками
 */
const cardsApi = {
  /**
   * Получение всех карточек
   * @returns {Promise<Array>} Список карточек
   */
  getCards: () => apiProvider(urlPaths.cards, { method: "GET" }),

  /**
   * Создание новой карточки
   * @param {string} name - Название карточки
   * @param {string} link - Ссылка на изображение
   * @returns {Promise<Object>} Ответ от сервера с созданной карточкой
   */
  createCard: (name, link) =>
    apiProvider(urlPaths.cards, {
      method: "POST",
      body: JSON.stringify({ name, link }),
    }),

  /**
   * Удаление карточки
   * @param {string} cardID - ID карточки
   * @returns {Promise<Object>} Ответ от сервера об удалении карточки
   */
  deleteCard: (cardID) =>
    apiProvider(`${urlPaths.card(cardID)}`, { method: "DELETE" }),

  /**
   * Поставить или снять лайк с карточки
   * @param {string} cardID - ID карточки
   * @param {boolean} isLiked - флаг, если true - ставим лайк, если false - снимаем
   * @returns {Promise<Object>} Ответ от сервера
   */
  toggleCardLike: (cardID, isLiked) => {
    const method = isLiked ? "PUT" : "DELETE";
    return apiProvider(`${urlPaths.cardLike(cardID)}`, { method });
  },
};

export { profileApi, cardsApi };
