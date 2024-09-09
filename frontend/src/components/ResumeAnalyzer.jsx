import React, { useState } from 'react';
import axios from 'axios';

const ResumeAnalyzer = () => {
    const [jd, setJD] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('jd', jd);
        formData.append('resume', resumeFile);

        try {
            const response = await axios.post("https://curveaismartats.onrender.com/analyze", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Response from backend:", response.data);
            setAnalysisResult(response.data);
        } catch (error) {
            console.error("Error analyzing resume:", error);
        }
    };

    return (
        <div className="relative font-outfit min-h-screen flex items-center justify-center">
            <div
                className='absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0'
                style={{
                    backgroundImage: 'url(/images/curveAiLogo.png)',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center'
                }}></div>
            <div className="relative z-10 p-6 bg-white rounded shadow-md w-full border-2 border-[#212121] max-w-lg">
                <h1 className="text-4xl text-center text-[#0f7377] mb-2">CurveAI Smart ATS</h1>
                <h2 className="text-center mb-4">Improve Your Resume ATS</h2>
                <textarea
                    className="w-full h-24 p-2 border border-gray-300 rounded mb-4"
                    placeholder="Paste the Job Description"
                    value={jd}
                    onChange={(e) => setJD(e.target.value)}
                />
                <div className='flex align-center justify-between mb-4'>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="my-4 border border-gray-300 rounded p-2"
                    />
                    <button onClick={handleSubmit} className="w-40 h-12 mt-4 bg-[#0f7377] text-white p-2 rounded">Submit</button>
                </div>

                {analysisResult && (
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

export default ResumeAnalyzer;