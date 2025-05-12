const config = {
    baseUrl: "https://nomoreparties.co/v1/wff-cohort-38",
    headers: {
        authorization: "33c061d5-f313-4f1b-840d-16309eab437d",
        "Content-Type": "application/json"
    }
};

const urlPaths = {
    me: `${config.baseUrl}/users/me`,
    meAvatar: `${config.baseUrl}/users/me/avatar`,
    cards: `${config.baseUrl}/cards`,
    card: (id) => `${config.baseUrl}/cards/${id}`,
    cardLike: (id) => `${config.baseUrl}/cards/likes/${id}`,
};

export  {config, urlPaths};