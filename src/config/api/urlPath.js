export default paths = {
    me: `${config.baseUrl}/users/me`,
    meAvatar: `${config.baseUrl}/users/me/avatar`,
    cards: `${config.baseUrl}/cards`,
    card: (id) => `${config.baseUrl}/cards/${id}`,
    cardLike: (id) => `${config.baseUrl}/cards/likes/${id}`,
  };