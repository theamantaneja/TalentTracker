from flask import Blueprint, request, jsonify
import os
import json
import PyPDF2 as pdf
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()  # Load environment variables
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

main = Blueprint('main', __name__)

def get_gemini_response(input):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(input)
    return response.text

def input_pdf_text(uploaded_file):
    reader = pdf.PdfReader(uploaded_file)
    text = ""
    for page in range(len(reader.pages)):
        text += reader.pages[page].extract_text() or ""
    return text

@main.route('/analyze', methods=['POST'])
def analyze():
    jd = request.form['jd']
    resume_file = request.files['resume']
    resume_text = input_pdf_text(resume_file)
    
    input_prompt = f"""
    Hey Act Like a skilled or very experienced ATS with a deep understanding of the tech field. Your task is to evaluate the resume based on the given job description. 
    resume: {resume_text}
    description: {jd}
    I want the response in one string having the structure
    {{"JD Match":"%","MissingKeywords":[],"Profile Summary":""}}
    """
    
    response = get_gemini_response(input_prompt)
    response_dict = json.loads(response)
    return jsonify(response_dict)
