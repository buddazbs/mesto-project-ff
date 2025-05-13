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
 * Универсальный обработчик отправки формы с асинхронным действием
 * @param {Event} evt - Событие формы
 * @param {Function} asyncAction - Асинхронная функция, которая выполняет основное действие
 * @param {HTMLElement} submitButton - Кнопка отправки формы
 * @param {string} [successCallback] - Функция, вызываемая после успешного выполнения
 */
const handleFormSubmission = async (evt, asyncAction, submitButton, successCallback) => {
    evt.preventDefault();
    submitButton.textContent = texts.saving;

    try {
        const result = await asyncAction();
        if (typeof successCallback === 'function') {
            successCallback(result);
        }
    } catch (err) {
        console.error("Ошибка при отправке формы:", err);
    } finally {
        submitButton.textContent = texts.save;
    }
};

/**
 * Рендерит карточку в DOM.
 * @param {Object} card - Объект карточки с сервера
 * @param {string} currentUserId - ID текущего пользователя
 * @param {Object} handlersCallback - Объект с обработчиками
 * @param {boolean} [prepend=false] - Добавить в начало списка
 */
const renderCard = (card, currentUserId, handlersCallback, prepend = false) => {
    const cardElement = createCard(card, currentUserId, handlersCallback);
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
 * Обрабатывает отправку формы профиля
 * @param {Event} evt - Событие отправки формы
 */
const handleFormSubmitEdit = (evt) => {
    handleFormSubmission(
        evt,
        () => profileApi.updateProfile(profileElements.nameInput.value, profileElements.jobInput.value),
        popupElements.profileSubmitButton,
        (profileData) => {
            profileElements.profileTitle.textContent = profileData.name;
            profileElements.profileDescription.textContent = profileData.about;
            hideModal(profileElements.editProfilePopup);
        }
    );
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
    handleFormSubmission(
        evt,
        () => profileApi.updateAvatar(profileElements.avatarInput.value),
        profileElements.avatarSubmitButton,
        (profileAvatar) => {
            profileElements.profileAvatar.style.backgroundImage = `url(${profileAvatar.avatar})`;
            hideModal(profileElements.avatarPopup);
        }
    );
};

/**
 * Обрабатывает отправку формы добавления карточки
 * @param {Event} evt - Событие отправки формы
 */
const handleFormSubmitAdd = (evt) => {
    handleFormSubmission(
        evt,
        () => cardsApi.createCard(
            cardElements.cardNameInput.value,
            cardElements.cardLinkInput.value
        ),
        cardElements.addCardSubmitButton,
        (newCard) => {
            renderCard(newCard, profileElements.profileId, handlersCallback, true);
            cardElements.addCardForm.reset();
            hideModal(cardElements.addCardPopup);
        }
    );
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