import { BACKEND_API_URL } from "../constants";
import axios from "axios";
import RegisterForm from "../models/RegisterForm";
import LoginForm from "../models/LoginForm";

export const register = (registerForm: RegisterForm) => {
    const registerData = { 
        user: registerForm
    };
    return axios.post(`${BACKEND_API_URL}/users`, registerData);
};

export const login = (loginForm: LoginForm) => {
    return axios
        .post(`${BACKEND_API_URL}/login`, loginForm)
        .then((response) => {
            if (response.data) {
                localStorage.setItem("token", JSON.stringify(response.data.token));
                localStorage.setItem("user", response.data.username);
                localStorage.setItem("user_id", response.data.user_id);
                localStorage.setItem("role", response.data.role);
            }
            return response.data;
        });
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
};

export const getCurrentUserToken = () => {
    return localStorage.getItem("token") || null;
};

export const getCurrentUserRole = () => {
    return localStorage.getItem("role") || undefined;
};

export const getCurrentUsername = () => {
    return localStorage.getItem("user") || undefined;
};

export const getCurrentUserId = () => {
    return localStorage.getItem("user_id") || undefined;
};