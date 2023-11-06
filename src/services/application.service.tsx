import axios from "axios";
import { getCurrentUserRole, getCurrentUserToken } from "./authentication.service";
import { BACKEND_API_URL } from "../constants";

export const isAuthenticated = () => {
    return getCurrentUserToken() !== null;
};

export const isAdmin = () => {
    return isAuthenticated() && getCurrentUserRole() === "admin";
};

export const isUserManager = () => {
    return isAuthenticated() && getCurrentUserRole() === "user_manager";
};

export const isRegularUser = () => {
    return isAuthenticated() && getCurrentUserRole() === "regular";
};

export const authenticationHeader = () => {
    const token = JSON.parse(getCurrentUserToken() || "{}");
    return { Authorization: token ? `${token}` : "" };
};

export const customAxios = () => {
    const axiosFunction = axios.create({
    baseURL: BACKEND_API_URL,
    headers: authenticationHeader(),
    });

    return axiosFunction;
};