import website from '@/const/website';
const TokenKey = website.storePrefix + 'x-access-token'
export function getToken() {
    return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
    return sessionStorage.setItem(TokenKey, token);
}

export function removeToken() {
    return sessionStorage.removeItem(TokenKey)
}