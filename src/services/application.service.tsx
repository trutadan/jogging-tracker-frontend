import { getCurrentUserRole, getCurrentUserToken } from "./authentication.service";
import { BACKEND_API_URL } from "../constants";
import axios, { AxiosInstance } from "axios";
import ExtendedTimeEntry from "../models/ExtendedTimeEntry";
import ExtendedTimeEntryWithUser from "../models/ExtendedTimeEntryWithUser";

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

export const customAxios = (): AxiosInstance => {
    const axiosFunction = axios.create({
        baseURL: BACKEND_API_URL,
        headers: authenticationHeader(),
    });

    return axiosFunction;
};

export const formatTimeWithLeadingZeros = (value: number) => {
    return value.toString().padStart(2, '0');
};

export const formatTime = (timeEntry?: ExtendedTimeEntry | ExtendedTimeEntryWithUser) => {
    if (!timeEntry) {
        return "00:00:00";
    }

    return `${formatTimeWithLeadingZeros(timeEntry.hours)}:${formatTimeWithLeadingZeros(timeEntry.minutes)}:${formatTimeWithLeadingZeros(timeEntry.seconds)}`;
};

export const formatWeekPeriod = (week: string) => {
    const weekParts = week.split('-');
    const weekNumber = parseInt(weekParts[0]);
    const year = parseInt(weekParts[1]);
  
    const startDate = new Date(year, 0, 1); 
    const firstDayOfWeek = startDate.getDay();
    const daysToMonday = (8 - firstDayOfWeek) % 7;
  
    startDate.setDate(startDate.getDate() + daysToMonday + (weekNumber - 1) * 7);
  
    const endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + 6);
  
    const formattedStartDate = startDate.toDateString();
    const formattedEndDate = endDate.toDateString();
  
    return `${formattedStartDate} - ${formattedEndDate}`;
  }