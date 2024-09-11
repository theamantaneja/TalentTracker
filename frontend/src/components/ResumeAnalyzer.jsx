import React, { useState } from 'react';
import axios from 'axios';

const ResumeAnalyzer = () => {
    const [jd, setJD] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        // Check if the job description is empty
        if (!jd) {
            setError("Job Description is required.");  // Set error message
            return;  // Exit the function early
        }

        setError('');  // Clear previous errors
        setLoading(true);  // Set loading state

        const formData = new FormData();
        formData.append('jd', jd);
        formData.append('resume', resumeFile);

        try {
            const response = await axios.post("http://localhost:5000/analyze", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setAnalysisResult(response.data);
        } catch (error) {
            console.error("Error analyzing resume:", error);
            setError("An error occurred while analyzing the resume.");  // Set error message if request fails
        } finally {
            setLoading(false);  // Reset loading state
        }
    };

    return (
        <div className="relative font-outfit min-h-screen flex items-center justify-center p-4">
            <div
                className='absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0'
                style={{
                    backgroundImage: 'url(/images/curveAiLogo.png)',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center'
                }}></div>
            <div className="relative z-10 p-6 bg-white rounded shadow-md w-full border-2 border-[#212121] max-w-lg">
                <h1 className="text-4xl text-center text-[#0f7377]">TalentTracker</h1>
                <p className='text-xs text-center mb-5'>A CurveAi product</p>
                <h2 className="text-center mb-4">Improve Your Resume for ATS</h2>
                <textarea
                    className="w-full h-24 p-2 border border-gray-300 rounded mb-4 resize-none"
                    placeholder="Paste the Job Description"
                    value={jd}
                    onChange={(e) => setJD(e.target.value)}
                />
                {error && (
                    <div className="text-red-500 mb-4">
                        <p>{error}</p>
                    </div>
                )}
                <div className='flex flex-col sm:flex-row align-center justify-between mb-4'>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="w-full sm:w-auto my-2 sm:my-0 border border-gray-300 rounded p-2"
                    />
                    <button onClick={handleSubmit} className="w-full sm:w-40 h-12 mt-4 sm:mt-0 bg-[#0f7377] text-white p-2 rounded">
                        Submit
                    </button>
                </div>

                {loading && (
                    <div className="text-center">
                        <p>Loading...</p>
                    </div>
                )}

                {analysisResult && !loading && (
                    <div className="mt-4">
                        <h3 className="text-2xl">Analysis Result:</h3>
                        <p>JD Match: {analysisResult["JD Match"]}%</p>
                        <p>Missing Keywords: {analysisResult["MissingKeywords"].join(", ")}</p>
                        <p>Profile Summary: {analysisResult["Profile Summary"]}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeAnalyzer;
