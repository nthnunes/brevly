import axios from "axios";
import { env } from "../utils/env";

export const api = axios.create({
  baseURL: env.BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
