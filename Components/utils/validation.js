export const formatEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export const formatPwd = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+.*)[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?a-zA-Z0-9]{6,21}$/

export const formatPseudo = /^[a-zA-Z0-9][a-zA-Z0-9-_]{4,14}[a-zA-Z0-9]$/
