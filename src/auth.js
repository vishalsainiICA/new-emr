import { adminInstance, commonInstance, doctorInstance, medicalDirectorInstance, perosnalAssistanceInstance, superAdminInstance } from "./utills";


export const commonApi = {
    fetchhospitalId: async (hospitalId) => {
        return await commonInstance.get(`/common/hospital/single-hospital?hospitalId=${hospitalId}`)
    },
    registerPatient: async (data) => {
        return await commonInstance.post(`/common/patient/register-patient`, data)
    },
    validateMobile: async (phone) => {
        return await commonInstance.post(`/common/patient/validate-mobile`, { "phone": phone })
    },
    patientsByHospitalId: async (id) => {
        return await superAdminInstance.get(`/common/hospital/all-patients?hospitalId=${id}`)
    },
    login: async (data) => {
        console.log('Data', data);
        return await commonInstance.post(`/login`, data)
    },

    changePatientStatus: async (id, newDate = null, cancelReason = null, type = null) => {
        return await commonInstance.put(`/common/change-status`, { id, newDate, cancelReason, type })
    },
    editHospital: async (data) => {
        return await commonInstance.put('/common/hospital/edit-hospital', data)
    },

    removeDoc: async (id) => {
        return await commonInstance.delete(`/common/doctor/remove-doc?docId=${id}`)
    },

    updateProfile: async (data) => {
        return await commonInstance.put(`/common/hospital/update-profile`, data)
    },
    newDepartment: async (data) => {
        return await commonInstance.post(`/common/hospital/new-department`, data)
    },

}
// superAdmin API
export const superAdminApi = {
    // hospital
    fetchProfile: async () => {
        return await superAdminInstance.get('/super-admin/auth/profile')
    },
    ediProfile: async (data) => {
        return await superAdminInstance.put('/super-admin/auth/edit-profile', data)
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
    editDepartment: async (hospitalId, depId, data) => {

        return await superAdminInstance.put(`/common/hospital/update-department?depId=${depId}&hospitalId=${hospitalId}`, data)
    },
    deletDepartment: async (hospitalId, depId) => {
        return await superAdminInstance.delete(`/common/hospital/delete-department?hospitalId=${hospitalId}&depId=${depId}`)
    },
    newDoctor: async (hospitalId, data) => {
        return await superAdminInstance.post('/common/hospital/new-doctor', data)
    },
    addAdmin: async (data) => {
        return await superAdminInstance.post('/super-admin/admin/add-admin', data)
    },
    editAdmin: async (id, updatedData) => {
        return await superAdminInstance.put(`/super-admin/admin/update-admin?id=${id}`, updatedData)
    },

    changeStatus: async (id, status) => {
        return await superAdminInstance.put(`/super-admin/admin/update-status?id=${id}&status=${status}`)
    },
    getAllAdmins: async () => {
        return await superAdminInstance.get('/super-admin/admin/all-admins')
    },
    deleteAdmin: async (id) => {
        return await superAdminInstance.delete(`/super-admin/admin/delete-admin?adminId=${id}`)
    },

    allPatients: async (date = null, status = null) => {
        return await superAdminInstance.get(`/super-admin/patients/allPatients?date=${date}&status=${status}`)
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
        return await medicalDirectorInstance.get('/medical-director/auth/profile')
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
    verfiyPin: async (tpin) => {
        return await doctorInstance.post('/doctor/auth/verfiyPin', { "tpin": tpin })
    },
    patientRegistration: async (formData) => {
        return await doctorInstance.post('/patient/patient-registration', formData)

    },

    ediProfile: async (data) => {
        return await doctorInstance.put('/doctor/auth/edit-profile', data)
    },
    getAllPatients: async (date = null, status = null) => {
        return await doctorInstance.get(`/doctor/all-patient-record?date=${date}&status=${status}`)
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

    dailyActivity: async () => {
        return await doctorInstance.get('/doctor/daily-activity')
    },
}

export const perosnalAssistantAPI = {
    saveInitialAssement: async (data, id) => {
        return await perosnalAssistanceInstance.post(`/assitant/intital-assement?patientId=${id}`, data)
    },
    getAllPatients: async (date = null, status = null) => {
        return await perosnalAssistanceInstance.get(`/assitant/all-patient-record?date=${date}&status=${status}`)
    },
    fetchProfile: async () => {
        return await perosnalAssistanceInstance.get('/assitant/auth/profile')
    },
    ediProfile: async (data) => {
        return await perosnalAssistanceInstance.put('/assitant/auth/edit-profile', data)
    },
    registerPatient: async (data) => {
        return await perosnalAssistanceInstance.post(`/assitant/patient/register-patient`, data)
    },
    dailyActivity: async () => {
        return await doctorInstance.get('/assitant/daily-activity')
    },

}

