import Cookies from 'js-cookie'
import website from '@/const/website';
const TokenKey = website.storePrefix + 'x-access-token'
export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token);
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}