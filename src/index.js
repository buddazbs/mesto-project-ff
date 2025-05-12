/**
 * Основной модуль приложения.
 * @module index
 */
import "@pages/index.css";
import "@vendor/normalize.css";
import "@vendor/fonts.css";
import { validationConfig } from "@/config/validation/validation.config";
import { createCard, deleteCard, toggleLike } from "@components/card";
import { showModal, hideModal, setupModal } from "@components/modal";
import { cardElements, profileElements, popupElements } from "@elements/dom";
import { clearValidation, enableValidation } from "@utilities/validation/validation";
import { profileApi, cardsApi } from "@api/api";

// Тексты для кнопок и сообщений
const texts = {
  saving: "Сохранение...",
  save: "Сохранить"
};

Promise.all([profileApi.getProfile(), cardsApi.getCards()])
  .then(([profileData, cards]) => {
    // Заполняем профиль
    profileElements.profileTitle.textContent = profileData.name;
    profileElements.profileDescription.textContent = profileData.about;
    profileElements.profileAvatar.style.backgroundImage = `url(${profileData.avatar})`;
    profileElements.profileAvatar.alt = `Аватар пользователя ${profileData.name}`;
    profileElements.profileId = profileData._id;

    // Рендерим карточки
    cards.forEach((card) => {
      if (card.owner && card._id) {
        renderCard({
          name: card.name,
          link: card.link,
          likes: card.likes || [],
          _id: card._id,
          owner: card.owner,
          currentUserId: profileElements.profileId,
          deleteCallback: deleteCard,
          likeCallback: toggleLike,
          openImageCallback: openImagePopup,
        });
      } else {
        console.warn(`Карточка пропущена: отсутствует owner или _id`, card);
      }
    });
  })
  .catch((err) => {
    console.error("Ошибка при загрузке данных:", err);
  });

// Настройка всех попапов
document.querySelectorAll(".popup").forEach(setupModal);

/**
 * Открывает попап с изображением.
 * @param {Object} cardData - Данные карточки
 * @param {string} cardData.name - Название места
 * @param {string} cardData.link - URL изображения
 */
const openImagePopup = ({ name, link }) => {
  popupElements.imagePopupImage.src = link;
  popupElements.imagePopupImage.alt = name;
  popupElements.imagePopupCaption.textContent = name;
  showModal(popupElements.imagePopup);
};

/**
 * Рендерит карточку в DOM.
 * @param {Object} cardData - Данные карточки
 * @param {boolean} [prepend=false] - Добавить в начало списка
 */
const renderCard = (cardData, prepend = false) => {
  const cardElement = createCard({
    name: cardData.name,
    link: cardData.link,
    likes: cardData.likes,
    _id: cardData._id,
    owner: cardData.owner,
    currentUserId: cardData.currentUserId,
    deleteCallback: cardData.deleteCallback,
    likeCallback: cardData.likeCallback,
    openImageCallback: cardData.openImageCallback,
  });

  if (prepend) {
    popupElements.placesList.prepend(cardElement);
  } else {
    popupElements.placesList.append(cardElement);
  }
};

/**
 * Обработчик клика по кнопке редактирования профиля
 */
const handleEditProfileClick = () => {
  profileElements.nameInput.value = profileElements.profileTitle.textContent;
  profileElements.jobInput.value = profileElements.profileDescription.textContent;
  clearValidation(profileElements.editProfilePopup.querySelector(".popup__form"), validationConfig);
  showModal(profileElements.editProfilePopup);
};

/**
 * Обработчик клика по кнопке добавления карточки
 */
const handleAddCardClick = () => {
  cardElements.addCardForm.reset();
  clearValidation(cardElements.addCardForm, validationConfig);
  showModal(cardElements.addCardPopup);
};

/**
 * Обновляет профиль пользователя
 */
const updateProfile = async () => {
  try {
    popupElements.profileSubmitButton.textContent = texts.saving;
    const profileData = await profileApi.updateProfile(profileElements.nameInput.value, profileElements.jobInput.value);
    
    profileElements.profileTitle.textContent = profileData.name;
    profileElements.profileDescription.textContent = profileData.about;
  } catch (err) {
    console.error("Ошибка при обновлении профиля:", err);
  } finally {
    popupElements.profileSubmitButton.textContent = texts.save;
  }
};

/**
 * Обрабатывает отправку формы профиля
 * @param {Event} evt - Событие отправки формы
 */
const handleFormSubmitEdit = (evt) => {
  evt.preventDefault();
  updateProfile();
  hideModal(profileElements.editProfilePopup);
};

const updaterProfileAvatar = () => {
  profileElements.avatarSubmitButton.textContent = texts.saving;
  const avatarUrl = profileElements.avatarInput.value;
  profileApi.updateAvatar(avatarUrl)
    .then(profileAvatar => {
      profileElements.profileAvatar.style.backgroundImage = `url(${profileAvatar.avatar})`;
      hideModal(profileElements.avatarPopup);
    })
    .catch((err) => {
      console.error("Ошибка при загрузке данных:", err);
    })
    .finally(() => {
      profileElements.avatarSubmitButton.textContent = texts.save;
    });
};

const handleEditProfileAvatar = (evt) => {
  evt.preventDefault();
  showModal(profileElements.avatarPopup);
};

const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  updaterProfileAvatar();
};

/**
 * Обрабатывает отправку формы добавления карточки
 * @param {Event} evt - Событие отправки формы
 */
const handleFormSubmitAdd = (evt) => {
  evt.preventDefault();
  cardsApi
    .createCard(cardElements.cardNameInput.value, cardElements.cardLinkInput.value)
    .then((newCard) => {
      renderCard(
        {
          name: newCard.name,
          link: newCard.link,
          likes: newCard.likes || [],
          _id: newCard._id,
          owner: newCard.owner,
          currentUserId: profileElements.profileId,
          deleteCallback: deleteCard,
          likeCallback: toggleLike,
          openImageCallback: openImagePopup,
        },
        true
      );
      cardElements.addCardForm.reset();
      clearValidation(cardElements.addCardForm, validationConfig);
      hideModal(cardElements.addCardPopup);
    })
    .catch(console.error);
};

// Привязка обработчиков событий
profileElements.profileAvatar.addEventListener("click", handleEditProfileAvatar);
profileElements.avatarPopup.querySelector(".popup__form").addEventListener("submit", handleAvatarFormSubmit);
profileElements.editProfileButton.addEventListener("click", handleEditProfileClick);
cardElements.addCardButton.addEventListener("click", handleAddCardClick);
profileElements.editProfilePopup.querySelector(".popup__form").addEventListener("submit", handleFormSubmitEdit);
cardElements.addCardForm.addEventListener("submit", handleFormSubmitAdd);

// Включение валидации для всех форм
enableValidation(validationConfig);