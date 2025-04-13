/**
 * Основной модуль приложения.
 * @module index
 */
import "./pages/index.css";
import "./vendor/normalize.css";
import "./vendor/fonts.css";
import { initialCards } from "./components/cards";
import { createCard, deleteCard, toggleLike } from "./components/card";
import { showModal, hideModal, setupModal } from "./components/modal";

// Элементы DOM
const placesList = document.querySelector(".places__list");
// Элементы попапов
const formElement = document.querySelector(".popup__form[name='edit-profile']");
const editProfilePopup = document.querySelector(".popup_type_edit");
const addCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const addCardButton = document.querySelector(".profile__add-button");
const editProfileButton = document.querySelector(".profile__edit-button");
const nameInput = formElement.querySelector(".popup__input_type_name");
const jobInput = formElement.querySelector(".popup__input_type_description");
const addCardForm = document.querySelector(".popup__form[name='new-place']");
const cardNameInput = addCardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = addCardForm.querySelector(".popup__input_type_url");

// Элементы профиля
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Элементы попапа с изображением
const imagePopupImage = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");

/**
 * Открывает попап с изображением.
 * @param {Object} cardData - Данные карточки
 * @param {string} cardData.name - Название места
 * @param {string} cardData.link - URL изображения
 */
const openImagePopup = ({ name, link }) => {
  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;
  showModal(imagePopup);
};
/**
 * Рендерит карточку в DOM.
 * @param {string} name - Название места
 * @param {string} link - URL изображения
 * @param {boolean} [prepend=false] - Добавить в начало списка
 */
const renderCard = (name, link, prepend = false) => {
  const cardElement = createCard({
    name,
    link,
    deleteCallback: deleteCard,
    likeCallback: toggleLike,
    openImageCallback: openImagePopup,
  });
  if (prepend) {
    placesList.prepend(cardElement);
  } else {
    placesList.append(cardElement);
  }
};

// Создание начальных карточек
initialCards.forEach((cardData) => renderCard(cardData.name, cardData.link));

// Настройка всех попапов
document.querySelectorAll(".popup").forEach(setupModal);

/**
 * Обработчик клика по кнопке редактирования профиля
 * @param {Event} evt - Событие клика
 */
const handleEditProfileClick = () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  showModal(editProfilePopup);
};

/**
 * Обработчик клика по кнопке добавления карточки
 * @param {Event} evt - Событие клика
 */
const handleAddCardClick = () => showModal(addCardPopup);

/**
 * Обновляет профиль пользователя
 * @param {string} name - Имя пользователя
 * @param {string} job - Описание пользователя
 */
const updateProfile = () => {
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
};
/**
 * Обрабатывает отправку формы профиля
 * @param {Event} evt - Событие отправки формы
 */
const handleFormSubmitEdit = (evt) => {
  evt.preventDefault();
  updateProfile();
  hideModal(editProfilePopup);
};

/**
 * Обрабатывает отправку формы добавления карточки
 * @param {Event} evt - Событие отправки формы
 */
const handleFormSubmitAdd = (evt) => {
  evt.preventDefault();
  renderCard(cardNameInput.value, cardLinkInput.value, true);
  hideModal(addCardPopup);
  addCardForm.reset();
};

editProfileButton.addEventListener("click", handleEditProfileClick);
addCardButton.addEventListener("click", handleAddCardClick);
formElement.addEventListener("submit", handleFormSubmitEdit);
addCardForm.addEventListener("submit", handleFormSubmitAdd);