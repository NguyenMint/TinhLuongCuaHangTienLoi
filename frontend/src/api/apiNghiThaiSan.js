import axios from "axios";
const API_URL = process.env.REACT_APP_BACKEND_URL + "/nghithaisan";

export const getAllNghiThaiSan = () => axios.get(API_URL);
export const getNghiThaiSanByMaTK = (MaTK) => axios.get(`${API_URL}/${MaTK}`);
export const createNghiThaiSan = (data) => axios.post(API_URL, data);
export const updateNghiThaiSan = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteNghiThaiSan = (id) => axios.delete(`${API_URL}/${id}`);
export const uploadGiayThaiSan = (file) => {
  const formData = new FormData();
  formData.append("giaythaisan", file);
  return axios.post(`${API_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}; 