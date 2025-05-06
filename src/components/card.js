import { cardsApi } from "@api/api";
/**
 * Модуль для работы с карточками
 * @module card
 */

/**
 * Создает DOM-элемент карточки
 * @param {Object} config - Конфигурация карточки
 * @param {string} config.name - Название места
 * @param {string} config.link - URL изображения
 * @param {Array} config.likes - Массив лайков
 * @param {string} config._id - Уникальный идентификатор карточки
 * @param {Object} [config.owner] - Данные владельца
 * @param {string} config.currentUserId - ID текущего пользователя
 * @param {Function} config.deleteCallback - Коллбэк удаления карточки
 * @param {Function} config.likeCallback - Коллбэк лайка карточки
 * @param {Function} config.openImageCallback - Коллбэк открытия изображения
 * @returns {HTMLElement} DOM-элемент карточки
 */
const createCard = ({ 
    name, 
    link, 
    likes = [], 
    _id, 
    owner, 
    currentUserId, 
    deleteCallback, 
    likeCallback, 
    openImageCallback 
}) => {
    const cardTemplate = document.querySelector('#card-template');
    const cardElement = cardTemplate.content.querySelector('.card').cloneNode(true);
  
    // Элементы карточки
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const likeCounter = cardElement.querySelector('.card__like-count');
  
    // Заполняем данные
    cardImage.src = link;
    cardImage.alt = `Фотография места: ${name}`;
    cardTitle.textContent = name;
    likeCounter.textContent = likes.length;
  
    // Управление кнопкой удаления
    if (!owner || owner._id !== currentUserId) {
        deleteButton.remove();
    }
  
    // Обработчики событий
    deleteButton.addEventListener('click', () => deleteCallback(_id, cardElement));
    likeButton.addEventListener('click', () => likeCallback(_id, likeButton, likeCounter));
    cardImage.addEventListener('click', () => openImageCallback({ name, link }));
  
    return cardElement;
};

/**
 * Удаляет карточку из DOM
 * @param {string} cardId - ID карточки
 * @param {HTMLElement} cardElement - Элемент карточки для удаления
 */
const deleteCard = (cardId, cardElement) => {
    cardsApi.deleteCard(cardId)
        .then(() => cardElement.remove())
        .catch(console.error);
};

/**
 * Переключает состояние лайка карточки
 * @param {string} cardId - ID карточки
 * @param {HTMLElement} likeButton - Кнопка лайка
 * @param {HTMLElement} likeCounter - Счетчик лайков
 */
const toggleLike = (cardId, likeButton, likeCounter) => {
    if (!cardId) {
        console.error('Ошибка: ID карточки не определён');
        return;
    }
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    cardsApi.toggleCardLike(cardId, !isLiked) // Отправляем противоположное состояние
        .then((updatedCard) => {
            likeButton.classList.toggle('card__like-button_is-active');
            likeCounter.textContent = updatedCard.likes.length;
        })
        .catch((err) => console.error(`Ошибка при переключении лайка: ${err}`));
};

export { createCard, deleteCard, toggleLike };