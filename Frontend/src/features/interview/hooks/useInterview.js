import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { InterviewContext } from "../Interview.context.js";
import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf,
} from "../services/interview.api.js";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();
    if (!context) throw new Error("useInterview must be used within an InterviewProvider.");

    const {
        loading, setLoading, report, setReport,
        reports, setReports, error, setError,
    } = context;

    const generateReport = async (payload) => {
        setLoading(true);
        setError("");
        try {
            const response = await generateInterviewReport(payload);
            setReport(response.interviewReport);
            return response.interviewReport;
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to generate the interview report. Please try again.");
            throw requestError;
        } finally {
            setLoading(false);
        }
    };

    const getReportById = async (id) => {
        setLoading(true);
        setError("");
        setReport(null);
        try {
            const response = await getInterviewReportById(id);
            setReport(response.interviewReport);
            return response.interviewReport;
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to load this interview report.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getReports = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getAllInterviewReports();
            setReports(response.interviewReports || []);
            return response.interviewReports || [];
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to load your previous reports.");
            return [];
        } finally {
            setLoading(false);
        }
    };

    const getResumePdf = async (id) => {
        setLoading(true);
        setError("");
        try {
            const blob = await generateResumePdf({ interviewReportId: id });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `resume_${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to generate the resume PDF.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (interviewId) getReportById(interviewId);
        else getReports();
        // Route ID is the intended trigger; context setters and imported services are stable.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interviewId]);

    return { loading, report, reports, error, generateReport, getReportById, getReports, getResumePdf };
};
