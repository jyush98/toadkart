import axios from "axios";

export const getBackendStatus = async () => {
  const response = await axios.get("http://localhost:8004/");
  return response.data;
};
