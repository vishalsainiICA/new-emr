import { adminInstance, commonInstance, doctorInstance, medicalDirectorInstance, perosnalAssistanceInstance, superAdminInstance } from "./utills";


export const commonApi = {
    fetchhospitalId: async (hospitalId) => {
        return await commonInstance.get(`/common/hospital/single-hospital?hospitalId=${hospitalId}`)
    },
    registerPatient: async (data) => {
        console.log('Data', data);

        return await commonInstance.post(`/common/patient/register-patient`, data)
    },
    patientsByHospitalId: async (id) => {
        return await superAdminInstance.get(`/common/hospital/all-patients?hospitalId=${id}`)
    },
    login: async (data) => {
        console.log('Data', data);
        return await commonInstance.post(`/login`, data)
    },


}
// superAdmin API
export const superAdminApi = {
    // hospital
    fetchProfile: async () => {
        return await superAdminInstance.get('/super-admin/auth/profile')
    },
    getAllhosptial: async () => {
        return await superAdminInstance.get('/super-admin/hospital/getAllHospital')
    },
    getHosptialMetrices: async () => {
        return await superAdminInstance.get('/super-admin/hospital/hosptial-metrices')
    },
    addHospital: async (data) => {
        return await superAdminInstance.post('/common/hospital/addHospital', data)
    },
    addBranch: async (hospitalId, data) => {
        return await superAdminInstance.post(`/common/hospital/add-branch?hospitalId=${hospitalId}`, data)
    },
    getHospitalById: async (hospitalId) => {
        return await superAdminInstance.get(`/common/hospital/single-hospital?hospitalId=${hospitalId}`)
    },
    editHospital: async (id, updatedData) => {
        return await superAdminInstance.put(`/common/hospital/update-hospital?id=${id}`, updatedData)
    },
    delethospital: async (id) => {
        return await superAdminInstance.delete(`/common/hospital/delete-hospital?id=${id}`)
    },
    newDepartment: async (hospitalId, data) => {
        return await superAdminInstance.post(`/common/hospital/new-department?hospitalId=${hospitalId}`, data)
    },
    editDepartment: async (hospitalId, depId, data) => {

        return await superAdminInstance.put(`/common/hospital/update-department?depId=${depId}&hospitalId=${hospitalId}`, data)
    },
    deletDepartment: async (hospitalId, depId) => {
        return await superAdminInstance.delete(`/common/hospital/delete-department?hospitalId=${hospitalId}&depId=${depId}`)
    },
    newDoctor: async (hospitalId, data) => {
        return await superAdminInstance.post('/common/hospital/new-doctor', data)
    },
    editDoctor: async (hospitalId, depId, data) => {
        return await superAdminInstance.put(`/common/hospital/update-doctor?depId=${depId}&docId=${depId}&hospitalId=${hospitalId}`, data)
    }

    // admin
    ,
    addAdmin: async (data) => {
        return await superAdminInstance.post('/super-admin/admin/add-admin', data)
    },
    editAdmin: async (id, updatedData) => {
        return await superAdminInstance.put(`/super-admin/admin/update-admin?id=${id}`, updatedData)
    },
    getAllAdmins: async () => {
        return await superAdminInstance.get('/super-admin/admin/all-admins')
    },
    deleteAdmin: async (id) => {
        return await superAdminInstance.delete(`/super-admin/admin/delete-admin?adminId=${id}`)
    },

    allPatients: async () => {
        return await superAdminInstance.get(`/super-admin/patients/allPatients`)
    },
    hospitalAllPaitent: async (id) => {
        return await superAdminInstance.get(`/super-admin/patients/hospitalAllPaitent?id=${id}`)
    },

    addPa: async (data) => {
        return await superAdminInstance.post('/super-admin/doctor/add-pa', data)
    },
    removePa: async (id) => {
        return await superAdminInstance.delete(`/super-admin/hospital/delete-pa?id=${id}`)
    },

    // updateAdmin : async(data)=>{

    // }
}
// Admin Api 

export const adminApi = {
    fetchProfile: async () => {
        return await adminInstance.get('/admin/auth/admin-profile')
    },
    getAllhosptial: async () => {
        return await adminInstance.get('/admin/hospital/all-hospitals')
    },
    addHospital: async (data) => {
        return await adminInstance.post('/common/hospital/addHospital', data)
    },
    addBranch: async (hospitalId, data) => {
        return await adminInstance.post(`/common/hospital/add-branch?hospitalId=${hospitalId}`, data)
    },
}
//medicalDirector

export const medicalDirectorApi = {
    fetchProfile: async () => {
        return await me.get('/medical-director/auth/profile')
    },
    getHospitalById: async (hospitalId) => {
        return await medicalDirectorInstance.get(`/common/hospital/single-hospital?hospitalId=${hospitalId}`)
    },

    getHospitalMedicalDirectorId: async () => {
        return await medicalDirectorInstance.get(`/medical-director/hospital/hospitalByDirId`)
    },

    getAllDepartmentByHospitalId: async () => {
        return await medicalDirectorInstance.get(`/medical-director/hospital/all-department`)
    }


}

// doctor
export const doctorAPi = {

    fetchProfile: async () => {
        return await doctorInstance.get('/doctor/auth/profile')
    },
    patientRegistration: async (formData) => {
        return await doctorInstance.post('/patient/patient-registration', formData)

    },
    getAllPatients: async () => {
        return await doctorInstance.get('/doctor/all-patient-record')
    },
    getAllPatientsAssements: async () => {
        return await doctorInstance.get('/patient/getAllPatientsAssement')
    },
    // HUD - Hospital Unique ID
    verifyHUD: async (uid) => {
        return await doctorInstance.get(`/patient/verifyUID?uid=${uid}`)
    },

    savePrescribtion: async (data) => {
        return await doctorInstance.post('/doctor/save-prescribtion', data)
    },
    getTodayPatient: async () => {
        return await doctorInstance.get('/doctor/today-Patient')
    },
    getAllIllness: async () => {
        return await doctorInstance.get('/doctor/all-illness')
    },

    changePatientStatus: async (id, newDate = null, cancelReason = null) => {
        return await doctorInstance.put(`/doctor/change-status`, { id, newDate, cancelReason })
    },
}

export const perosnalAssistantAPI = {
    saveInitialAssement: async (data, id) => {
        return await perosnalAssistanceInstance.post(`/assitant/intital-assement?patientId=${id}`, data)
    },
    getAllPatients: async () => {
        return await perosnalAssistanceInstance.get('/assitant/all-patient-record')
    },
    fetchProfile: async () => {
        return await perosnalAssistanceInstance.get('/assitant/auth/profile')
    },
}

