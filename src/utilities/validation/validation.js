import { validationConfig } from "../../config/validation/validation.config.js";
/**
 * Создает функцию для отображения ошибки ввода.
 * @param {Object} errorElements - Объект, содержащий элементы ошибок для каждого поля ввода.
 * @param {Object} validationConfig - Конфигурационный объект с классами стилей.
 * @returns {Function} Функция, которая принимает поле ввода и сообщение об ошибке, и отображает ошибку.
 */
const createShowInputError =
  (errorElements, validationConfig) => (popupInput, errorMessage) => {
    const formError = errorElements[popupInput.id];
    if (!formError) {
      console.warn(`Не найден элемент ошибки для id: ${popupInput.id}`);
      return;
    }
    popupInput.classList.add(validationConfig.inputErrorClass);
    formError.textContent = errorMessage;
    formError.classList.add(validationConfig.errorClass);
  };

/**
 * Создает функцию для скрытия ошибки ввода.
 * @param {Object} errorElements - Объект, содержащий элементы ошибок для каждого поля ввода.
 * @param {Object} validationConfig - Конфигурационный объект с классами стилей.
 * @returns {Function} Функция, которая принимает поле ввода и скрывает ошибку.
 */
const createHideInputError =
  (errorElements, validationConfig) => (popupInput) => {
    const formError = errorElements[popupInput.id];
    popupInput.classList.remove(validationConfig.inputErrorClass);
    if (formError) {
      formError.classList.remove(validationConfig.errorClass);
      formError.textContent = "";
    }
  };

/**
 * Создает функцию для проверки валидности поля ввода.
 * @param {Function} showInputError - Функция для отображения ошибки.
 * @param {Function} hideInputError - Функция для скрытия ошибки.
 * @returns {Function} Функция, которая принимает поле ввода и проверяет его валидность.
 */
const createIsValid = (showInputError, hideInputError) => (popupInput) => {
  popupInput.setCustomValidity(
    popupInput.validity.patternMismatch ? popupInput.dataset.errorMessage : ""
  );
  !popupInput.validity.valid
    ? showInputError(popupInput, popupInput.validationMessage)
    : hideInputError(popupInput);
};

/**
 * Переключает состояние кнопки в зависимости от валидности полей ввода.
 * @param {Array} inputList - Список полей ввода.
 * @param {HTMLElement} buttonElement - Элемент кнопки.
 * @param {Object} validationConfig - Конфигурационный объект с классами стилей.
 */
const toggleButtonState = (inputList, buttonElement, validationConfig) => {
    const hasInvalidInput = inputList.some((input) => !input.validity.valid);
    if (hasInvalidInput) {
        buttonElement.disabled = true;
        buttonElement.classList.add(validationConfig.inactiveButtonClass);
    } else {
        buttonElement.disabled = false;
        buttonElement.classList.remove(validationConfig.inactiveButtonClass);
    }
};


/**
 * Устанавливает слушатели событий для формы.
 * @param {HTMLElement} popupFormElement - Элемент формы.
 * @param {Object} validationConfig - Конфигурационный объект с классами стилей.
 */
const setEventListeners = (popupFormElement, validationConfig) => {
  const inputList = Array.from(popupFormElement.querySelectorAll("input"));
  const buttonElement = popupFormElement.querySelector(
    validationConfig.buttonElement
  );
  const errorElements = inputList.reduce((acc, input) => {
    acc[input.id] = popupFormElement.querySelector(`.${input.id}-input-error`);
    return acc;
  }, {});

  const showInputError = createShowInputError(errorElements, validationConfig);
  const hideInputError = createHideInputError(errorElements, validationConfig);
  const isValid = createIsValid(showInputError, hideInputError);

  const localToggleButtonState = () =>
    toggleButtonState(inputList, buttonElement, validationConfig);

  localToggleButtonState();
  inputList.forEach((popupInput) => {
    popupInput.addEventListener("input", () => {
      isValid(popupInput);
      localToggleButtonState();
    });
  });
};

/**
 * Включает валидацию для всех форм на странице.
 */
const enableValidation = () => {
  Array.from(
    document.querySelectorAll(validationConfig.popupFormElement)
  ).forEach((popupFormElement) =>
    setEventListeners(popupFormElement, validationConfig)
  );
};

/**
 * Очищает валидацию для формы.
 * @param {HTMLElement} popupFormElement - Элемент формы.
 */
const clearValidation = (popupFormElement) => {
  const inputList = Array.from(
    popupFormElement.querySelectorAll(validationConfig.popupInput)
  );
  const buttonElement = popupFormElement.querySelector(
    validationConfig.buttonElement
  );
  const errorElements = inputList.reduce((acc, input) => {
    acc[input.id] = popupFormElement.querySelector(`.${input.id}-input-error`);
    return acc;
  }, {});
  const hideInputError = createHideInputError(errorElements, validationConfig);
  inputList.forEach(hideInputError);
  toggleButtonState(inputList, buttonElement, validationConfig);
};

export { enableValidation, clearValidation };
