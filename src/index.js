import "./pages/index.css";
import "./vendor/normalize.css";
import "./vendor/fonts.css";
import { initialCards } from "./components/cards";
import { createCard, deleteCard, toggleLike } from "./components/card";
import { showModal, hideModal, setupModal } from "./components/modal";

// Элементы DOM
const placesList = document.querySelector(".places__list");
// Элементы попапов
const formEditProfile = document.querySelector(
  ".popup__form[name='edit-profile']"
);
const editProfilePopup = document.querySelector(".popup_type_edit");
const addCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const addCardButton = document.querySelector(".profile__add-button");
const editProfileButton = document.querySelector(".profile__edit-button");
const nameInput = formEditProfile.querySelector(".popup__input_type_name");
const jobInput = formEditProfile.querySelector(
  ".popup__input_type_description"
);
const formAdd = document.querySelector(".popup__form[name='new-place']");
const placeInput = formAdd.querySelector(".popup__input_type_card-name");
const linkInput = formAdd.querySelector(".popup__input_type_url");
// Элементы профиля
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Элементы попапа с изображением
const imagePopupImage = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");

// Функция для открытия попапа с изображением
const openImagePopup = ({ name, link }) => {
  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;
  showModal(imagePopup);
};

// Функция для добавления карточки
function addCard(title, srcImg) {
    const cardElement = createCard({
        name: title,
        link: srcImg,
        deleteCallback: deleteCard,
        likeCallback: toggleLike,
        openImageCallback: openImagePopup,
      });
    placesList.prepend(cardElement);
  }

// Создание карточек из начального массива
initialCards.forEach((cardData) => {
  const cardElement = createCard({
    name: cardData.name,
    link: cardData.link,
    deleteCallback: deleteCard,
    likeCallback: toggleLike,
    openImageCallback: openImagePopup,
  });
  placesList.append(cardElement);
});

// Настройка всех попапов
document.querySelectorAll(".popup").forEach(setupModal);

// Обработчики событий
const handleEditProfileClick = () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  showModal(editProfilePopup);
};

const handleAddCardClick = () => showModal(addCardPopup);

editProfileButton.addEventListener("click", handleEditProfileClick);
addCardButton.addEventListener("click", handleAddCardClick);

const handleFormSubmitEdit = (evt) => {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  hideModal(editProfilePopup);
}
formEditProfile.addEventListener("submit", handleFormSubmitEdit);

const handleFormSubmitAdd = (evt) => {
  evt.preventDefault();
  addCard(placeInput.value, linkInput.value);
  hideModal(addCardPopup);
  formAdd.reset();
}
formAdd.addEventListener("submit", handleFormSubmitAdd);
