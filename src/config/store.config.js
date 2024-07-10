import { createStore } from "vuex"

const userName = "userName";
const jwtToken = "jwtToken";

const store = createStore({
    state: {
        userName: null,
        jwtToken: null
    },
    mutations: {
        setJwtToken(state, token) {
            state.jwtToken = token;
            localStorage.setItem(jwtToken, JSON.stringify(token));
        },
        setUserName(state, name) {
            state.userName = name;
            localStorage.setItem(userName, JSON.stringify(name));
        }
    }
})

export function getJwtToken() {
    return JSON.parse(localStorage.getItem(jwtToken));
}

export function getUserName() {
    return JSON.parse(localStorage.getItem(userName));
}

export default store