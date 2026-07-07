const {GoogleGenAI} = require('@google/genai');
const {z} =  require("zod");
// const {zodToJsonSchema} = require("zod-to-json-schema");
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});
const puppeteer = require('puppeteer');


async function invokeGeminiAi(){
    const response = await ai.models.generateContent({
        model:"gemini-3-flash-preview",
        contents:"Hello Gemini, Explain what is Interview ?"
    })
    console.log(response.text);
}
const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate matches the job requirements"),
    technicalQuestions: z.array(z.object({
        question:z.string().describe("The technical question can be asked in the interview"),
        intention:z.string().describe("The intention of interviewer behind asking the technical question"),
        answer:z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question:z.string().describe("The behavioral question can be asked in the interview"),
        intention:z.string().describe("The intention of interviewer behind asking the behavioral question"),
        answer:z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along"),
    skillGaps: z.array(z.object({
        skill:z.string().describe("The skill that the candidate is lacking based on the job describe and resume"),
        severity:z.enum(["Low", "Medium", "High"]).describe("The severity of the skill gap, i.e., how important it is to address this skill gap before the interview")
    })).describe("The skill gaps that the candidate has based on the job describe and resume along with their severity"),
    preparationPlan: z.array(z.object({
        day:z.number().describe("The day number in the preparation plan, e.g., Day 1, Day 2, etc."),
        focus:z.string().describe("The focus of the preparation for that day, e.g.,data structures, system design, behavioral questions, etc."),
        tasks:z.array(z.string()).describe("The tasks to be completed on that day to prepare for the interview, e.g., read a specific book, solve a set of problems, etc.")
    })).describe("The preparation plan for the candidate to prepare for the interview, including the focus and tasks for each day"),
    title : z.string().describe("The title of the job for which the interview report is generated")
})
const schema = z.toJSONSchema(interviewReportSchema);
// console.log(JSON.stringify(schema, null, 2));
async function generateInterviewReport(resume,selfDescription,jobDescription){
    console.log("Generating interview report...");
    const prompt=`Generate an interview report for a candidate with the following information:

IMPORTANT:
1. Extract ALL required skills from the Job Description.
2. Extract ALL skills mentioned in the Resume.
3. Compare them carefully.
4. Include EVERY missing skill in skillGaps.
5. Do not omit any missing skills.
6. Assign severity:
   - High = explicitly required in the JD
   - Medium = preferred qualifications
   - Low = optional skills
7.Generate minimum 5 technical and 5 behavioral questions based on the resume, self description and job description(Mandatory atleast 5 technicalquestionsand 5 behavioral questions).
8.Generate a detailed preparation plan for 7 days, with specific focus and tasks for each day(Mandatory 7 days plan).
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
   
    `;
    
    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: z.toJSONSchema(interviewReportSchema)
    }
});

return JSON.parse(response.text);
}
async function generatePdfFromHtml(htmlContent){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent,{ waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({format:'A4',margin:
{top:'20px',bottom:'20px',left:'15px',right:'15px'}});
    
    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({resume,selfDescription,jobDescription}){


    const resumepdfSchema = z.object({
        html:z.string().describe("The HTML content of the resume which can be converted to PDF using any library like Puppeteer")
        });
        const prompt = `Generate a resume for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}

        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like Puppeteer.
        the resume should be tailored for the given job description and should highlight the candidate's strenghts and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
        the content of the resume should be not sound like it's generated by AI and should be as close as possible to resemble a human-written resume.
        You can highlight the content using some colors or different font styles but the overall design should be simple and professional.
        the content should be ATS friendly and should be easily parsed by ATS systems. Avoid using images, graphics, or complex formatting that may not be compatible with ATS systems. Use standard fonts and formatting to ensure that the resume can be easily read and parsed by ATS systems.
        the resume should not be so lengthy, it should be ideally 1-2 pages long and should be concise and to the point. Avoid including unnecessary details or information that does not directly relate to the job description. Focus on highlighting the candidate's most relevant skills, experience, and achievements that align with the requirements of the job description.
        
        `
    const response = await ai.models.generateContent({
        model:"gemini-3-flash-preview",
        contents:prompt,
        config:{
            responseMimeType:"application/json",
            responseSchema:z.toJSONSchema(resumepdfSchema)
        }
    })
    const jsonContent = JSON.parse(response.text);
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
    return pdfBuffer;
}
module.exports = {
    generateInterviewReport,
    generateResumePdf
    }

