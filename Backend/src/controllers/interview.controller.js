const { PDFParse } = require("pdf-parse");
const mongoose = require("mongoose");
const interviewReportModel = require("../models/interviewReport.model");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");

const MAX_JOB_DESCRIPTION_LENGTH = 12000;
const MAX_SELF_DESCRIPTION_LENGTH = 8000;
const MAX_RESUME_TEXT_LENGTH = 40000;

async function extractResumeText(file) {
    if (!file) return "";
    if (!file.buffer.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
        const error = new Error("The uploaded file is not a valid PDF.");
        error.statusCode = 400;
        throw error;
    }

    const parser = new PDFParse({ data: file.buffer });
    try {
        const parsed = await parser.getText();
        return String(parsed.text || "").trim();
    } catch {
        const error = new Error("Unable to read this PDF. Please upload a valid, text-based PDF.");
        error.statusCode = 400;
        throw error;
    } finally {
        await Promise.resolve().then(() => parser.destroy()).catch(() => {});
    }
}

async function generateInterviewReportController(req, res) {
    const jobDescription = String(req.body.jobDescription || "").trim();
    const selfDescription = String(req.body.selfDescription || "").trim();

    if (!jobDescription) {
        return res.status(400).json({ message: "Please provide the target job description." });
    }
    if (jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
        return res.status(400).json({ message: `Job description must be ${MAX_JOB_DESCRIPTION_LENGTH} characters or fewer.` });
    }
    if (selfDescription.length > MAX_SELF_DESCRIPTION_LENGTH) {
        return res.status(400).json({ message: `Self-description must be ${MAX_SELF_DESCRIPTION_LENGTH} characters or fewer.` });
    }
    if (!req.file && !selfDescription) {
        return res.status(400).json({ message: "Upload a PDF resume or provide a self-description." });
    }

    const resumeText = await extractResumeText(req.file);
    if (req.file && !resumeText) {
        return res.status(400).json({ message: "No readable text was found in the PDF. Please upload a text-based resume." });
    }
    if (resumeText.length > MAX_RESUME_TEXT_LENGTH) {
        return res.status(400).json({ message: "The extracted resume is too long. Please upload a shorter resume." });
    }

    const reportData = await generateInterviewReport(resumeText, selfDescription, jobDescription);
    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeText,
        selfDescription,
        jobDescription,
        ...reportData,
    });

    return res.status(201).json({ message: "Interview report generated successfully.", interviewReport });
}

async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;
    if (!mongoose.isValidObjectId(interviewId)) {
        return res.status(400).json({ message: "Invalid interview report ID." });
    }
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });
    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." });
    }
    return res.status(200).json({ message: "Interview report fetched successfully.", interviewReport });
}

async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
    return res.status(200).json({ message: "Interview reports fetched successfully.", interviewReports });
}

async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params;
    if (!mongoose.isValidObjectId(interviewReportId)) {
        return res.status(400).json({ message: "Invalid interview report ID." });
    }
    const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id });
    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." });
    }

    const pdfBuffer = await generateResumePdf({
        resume: interviewReport.resume || "",
        selfDescription: interviewReport.selfDescription || "",
        jobDescription: interviewReport.jobDescription,
    });
    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
        "Content-Length": pdfBuffer.length,
        "Cache-Control": "no-store",
    });
    return res.send(pdfBuffer);
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
};
