import axios from 'axios'
const baseUrl = "http://localhost:3001/api/users/"

const getUser = async (token: string | null) => {
    const response = await axios.get(baseUrl + "info", {
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
        },
    });
    return response;
};

const login = async (username: string, password: string) => {
    const response = await axios.post(baseUrl + "login", {username, password})
    return response.data
}

const signup = async (username: string, password: string) => {
    const response = await axios.post(baseUrl + "signup", {username, password})
    return response.data
}

const addStreak = async (token: string) => {
    const response = await axios.post(baseUrl + 'addStreak')
    return response
}


const userService = {getUser, login, signup, addStreak}
export default userService