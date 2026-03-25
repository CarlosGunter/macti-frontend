const centralizedApiURLBase = "https://macti-api.onrender.com";
const localhostApiURL = "http://localhost:8000";
const runtimeEnvironment = process.env.NODE_ENV;

export const apiURLBase =
  runtimeEnvironment === "development" ? localhostApiURL : centralizedApiURLBase;
