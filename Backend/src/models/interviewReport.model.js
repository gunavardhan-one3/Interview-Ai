const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true, trim: true },
    intention: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
}, { _id: false });

const skillGapSchema = new mongoose.Schema({
    skill: { type: String, required: true, trim: true },
    severity: { type: String, enum: ["Low", "Medium", "High"], required: true },
}, { _id: false });

const preparationDaySchema = new mongoose.Schema({
    day: { type: Number, required: true, min: 1, max: 7 },
    focus: { type: String, required: true, trim: true },
    tasks: [{ type: String, required: true, trim: true }],
}, { _id: false });

const interviewReportSchema = new mongoose.Schema({
    jobDescription: { type: String, required: true, trim: true },
    resume: { type: String, default: "" },
    selfDescription: { type: String, default: "" },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    technicalQuestions: { type: [questionSchema], required: true },
    behavioralQuestions: { type: [questionSchema], required: true },
    skillGaps: { type: [skillGapSchema], default: [] },
    preparationPlan: { type: [preparationDaySchema], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true, index: true },
    title: { type: String, required: true, trim: true },
}, { timestamps: true });

interviewReportSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("InterviewReport", interviewReportSchema);
