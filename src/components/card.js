/**
 * Модуль для работы с карточками
 * @module card
 */

/**
 * Создает DOM-элемент карточки
 * @param {Object} config - Конфигурация карточки
 * @param {string} config.name - Название места
 * @param {string} config.link - URL изображения
 * @param {Function} config.deleteCallback - Коллбэк удаления карточки
 * @param {Function} config.likeCallback - Коллбэк лайка карточки
 * @param {Function} config.openImageCallback - Коллбэк открытия изображения
 * @returns {HTMLElement} DOM-элемент карточки
 */
const createCard = ({ name, link, deleteCallback, likeCallback, openImageCallback }) => {
    const cardTemplate = document.querySelector('#card-template');
    const cardElement = cardTemplate.content.querySelector('.card').cloneNode(true);

    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');

    cardImage.src = link;
    cardImage.alt = `Фотография места: ${name}`;
    cardTitle.textContent = name;

    deleteButton.addEventListener('click', () => deleteCallback(cardElement));
    likeButton.addEventListener('click', likeCallback);
    cardImage.addEventListener('click', () => openImageCallback({ name, link }));

    return cardElement;
};
/**
 * Удаляет карточку из DOM
 * @param {HTMLElement} cardElement - Элемент карточки для удаления
 */
const deleteCard = (cardElement) => {
    cardElement.remove();
}
/**
 * Переключает состояние лайка карточки
 * @param {MouseEvent} evt - Событие клика по кнопке лайка
 */
const toggleLike = (evt) => {
    if (evt.target.classList.contains('card__like-button'))
        evt.target.classList.toggle('card__like-button_is-active');
}

export { createCard, deleteCard, toggleLike };