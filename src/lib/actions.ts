import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "./session";
const serverUrl = "http://localhost:3000";

export const getAccessToken = async () => {
  const session = await getServerSession(authOptions);
  return session?.accessToken;
};

export const currentUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const fetchToken = async () => {
  try {
    const response = await axios.get(`${serverUrl}/api/auth/token`);
    return response.data.token;
  } catch (err) {
    throw err;
  }
};

export const getProfile = async () => {
  console.log("getProfile called");
  const response = await fetch("http://localhost:8080/api/profile");
  // console.log("response", response.json());

  return response.json();
};
