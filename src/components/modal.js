// Открытие модального окна
const showModal = (modalElement) => {
    modalElement.classList.add("popup_is-opened");
    document.addEventListener("keydown", escapeClose);
  };
  
  // Закрытие модального окна
  const hideModal = (modalElement) => {
    modalElement.classList.remove("popup_is-opened");
    document.removeEventListener("keydown", escapeClose);
  };
  
  // Закрытие по клавише Escape
  const escapeClose = (event) => {
    if (event.key === "Escape") {
      const openedModal = document.querySelector(".popup_is-opened");
      if (openedModal) hideModal(openedModal);
    }
  };
  
  // Настройка модального окна (оверлей и кнопка закрытия)
  const setupModal = (modalElement) => {
    modalElement.addEventListener("mousedown", (evt) => {
      if (evt.target === modalElement) hideModal(modalElement);
    });
  
    const closeButton = modalElement.querySelector(".popup__close");
    if (closeButton) closeButton.addEventListener("click", () => hideModal(modalElement));
  };
  
  export { showModal, hideModal, setupModal };