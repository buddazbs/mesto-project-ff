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

/**
 * Открывает попап с изображением.
 * @param {Object} cardData - Данные карточки
 */
const openImagePopup = ({ name, link }) => {
    popupElements.imagePopupImage.src = link;
    popupElements.imagePopupImage.alt = name;
    popupElements.imagePopupCaption.textContent = name;
    showModal(popupElements.imagePopup);
};

// Объект обработчиков для карточек
const handlersCallback = {
    deleteCallback: deleteCard,
    likeCallback: toggleLike,
    openImageCallback: openImagePopup,
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
                renderCard(card, profileElements.profileId, handlersCallback);
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
 * Рендерит карточку в DOM.
 * @param {Object} card - Объект карточки с сервера
 * @param {string} currentUserId - ID текущего пользователя
 * @param {Object} handlers - Объект с обработчиками
 * @param {boolean} [prepend=false] - Добавить в начало списка
 */
const renderCard = (card, currentUserId, handlers, prepend = false) => {
    const cardElement = createCard(card, currentUserId, handlers);
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
    clearValidation(profileElements.editProfileForm, validationConfig);
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
        hideModal(profileElements.editProfilePopup);
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
};

/**
 * Обновляет аватар пользователя
 */
const updateProfileAvatar = async () => {
    try {
        profileElements.avatarSubmitButton.textContent = texts.saving;
        const profileAvatar = await profileApi.updateAvatar(profileElements.avatarInput.value);
        profileElements.profileAvatar.style.backgroundImage = `url(${profileAvatar.avatar})`;
        hideModal(profileElements.avatarPopup);
    } catch (err) {
        console.error("Ошибка при обновлении аватара:", err);
    } finally {
        profileElements.avatarSubmitButton.textContent = texts.save;
    }
};

/**
 * Обработчик клика по аватару для редактирования
 */
const handleEditProfileAvatar = (evt) => {
    evt.preventDefault();
    profileElements.avatarInput.value = ""; // Очистка поля перед открытием
    showModal(profileElements.avatarPopup);
};

/**
 * Обрабатывает отправку формы аватара
 * @param {Event} evt - Событие отправки формы
 */
const handleAvatarFormSubmit = (evt) => {
    evt.preventDefault();
    updateProfileAvatar();
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
            renderCard(newCard, profileElements.profileId, handlers, true);
            cardElements.addCardForm.reset();
            hideModal(cardElements.addCardPopup);
        })
        .catch(console.error);
};

// Привязка обработчиков событий
profileElements.profileAvatar.addEventListener("click", handleEditProfileAvatar);
profileElements.avatarForm.addEventListener("submit", handleAvatarFormSubmit);
profileElements.editProfileButton.addEventListener("click", handleEditProfileClick);
cardElements.addCardButton.addEventListener("click", handleAddCardClick);
profileElements.editProfileForm.addEventListener("submit", handleFormSubmitEdit);
cardElements.addCardForm.addEventListener("submit", handleFormSubmitAdd);

// Включение валидации для всех форм
enableValidation(validationConfig);