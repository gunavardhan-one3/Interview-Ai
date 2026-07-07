import axios from 'axios';

const api=axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
})

/**
 * @description service to Generate interview report on the basis of user self description, resume pdf and job description 
 */

export const generateInterviewReport =async ({jobDescription, selfDescription, resumeFile})=>{

    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);
    const response = await api.post('api/interview/', formData, {
        headers:{
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data;

}

/**
 * @description service to fetch interview report by ID
 */
export const getInterviewReportById = async (interviewId)=>{
    const response = await api.get(`api/interview/report/${interviewId}`);
    return response.data;
}

/**
 * @description service to fetch all interview reports of the logged in user
 */
export const getAllInterviewReports = async () =>{
    const response = await api.get('api/interview/');
    return response.data;
}

/**
 * @description service to generate resume pdf on the basis of user self description, resume pdf and job description
 */
export const generateResumePdf = async ({interviewReportId})=>{
    const response = await api.post(`api/interview/resume/pdf/${interviewReportId}`,null, {
        responseType: "blob"
    });
    return response.data;
}

  