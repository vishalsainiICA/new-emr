import axios from "axios";

export const commonInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
  withCredentials: true,
})

//  super Admin
export const superAdminInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000, // 
  withCredentials: true,
});

superAdminInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("SuperAdmintoken");
  console.log('intecepto', token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



export const adminInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 1000,
  withCredentials: true,
})

adminInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("Admintoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const medicalDirectorInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 1000,
  withCredentials: true,
  headers: {
    "Content-Type": 'application/json'
  }
})

medicalDirectorInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("MedicalDirector");
  console.log('tokem', token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const doctorInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 1000,
  withCredentials: true,
  headers: {
    "Content-Type": 'application/json'
  }
})

doctorInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("Doctor");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Converts nested object → FormData
export const createFormData = (obj, form = new FormData(), namespace = '') => {
  for (let key in obj) {
    if (obj[key] === undefined || obj[key] === null) continue;

    const formKey = namespace ? `${namespace}[${key}]` : key;

    if (obj[key] instanceof File) {
      form.append(formKey, obj[key]);
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      createFormData(obj[key], form, formKey);
    } else if (Array.isArray(obj[key])) {
      obj[key].forEach((item, index) => {
        if (typeof item === 'object') {
          createFormData(item, form, `${formKey}[${index}]`);
        } else {
          form.append(`${formKey}[${index}]`, item);
        }
      });
    } else {
      form.append(formKey, obj[key]);
    }
  }
  return form;
};
