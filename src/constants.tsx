const PROD_BACKEND_API_URL = "/api";
const DEV_BACKEND_API_URL = "http://localhost:3000/api";

export const BACKEND_API_URL =
  process.env.NODE_ENV === "development"
    ? DEV_BACKEND_API_URL
    : PROD_BACKEND_API_URL;