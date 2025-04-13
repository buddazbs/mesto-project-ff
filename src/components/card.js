

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

const deleteCard = (cardElement) => {
    cardElement.remove();
}

const toggleLike = (evt) => {
    if (evt.target.classList.contains('card__like-button'))
        evt.target.classList.toggle('card__like-button_is-active');
}

export { createCard, deleteCard, toggleLike };