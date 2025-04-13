/**
 * Модуль для работы с модальными окнами
 * @module modal
 */
/** @type {HTMLElement|null} Текущее открытое модальное окно */
let currentOpenedModal = null;

/**
 * Показывает модальное окно
 * @param {HTMLElement} modalElement - DOM-элемент модального окна
 */
const showModal = (modalElement) => {
  modalElement.classList.add("popup_is-opened");
  currentOpenedModal = modalElement;
  document.addEventListener("keydown", escapeClose);
};

/**
 * Скрывает модальное окно
 * @param {HTMLElement} modalElement - DOM-элемент модального окна
 */
const hideModal = (modalElement) => {
  modalElement.classList.remove("popup_is-opened");
  if (currentOpenedModal === modalElement) {
    currentOpenedModal = null;
  }
  document.removeEventListener("keydown", escapeClose);
};

/**
 * Скрывает модальное окно при нажатии клавиши Escape
 * @param {HTMLElement} modalElement - DOM-элемент модального окна
 */
const escapeClose = (event) => {
  if (event.key === "Escape" && currentOpenedModal) {
    hideModal(currentOpenedModal);
  }
};

/**
 * Настраивает обработчики для модального окна
 * @param {HTMLElement} modalElement - DOM-элемент модального окна
 */
const setupModal = (modalElement) => {
  modalElement.addEventListener("mousedown", (evt) => {
    if (evt.target === modalElement) hideModal(modalElement);
  });

  const closeButton = modalElement.querySelector(".popup__close");
  if (closeButton) closeButton.addEventListener("click", () => hideModal(modalElement));
};

export { showModal, hideModal, setupModal };