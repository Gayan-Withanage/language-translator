"""
Language Translator — FastAPI Backend
Install: pip install fastapi uvicorn deep-translator langdetect
Run:     uvicorn main:app --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from deep_translator import GoogleTranslator
from langdetect import detect, LangDetectException

app = FastAPI(title="Language Translator API")

# Allow requests from React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

LANGUAGE_NAMES = {
    "en": "English", "es": "Spanish", "fr": "French", "de": "German",
    "it": "Italian", "pt": "Portuguese", "zh-cn": "Chinese (Simplified)",
    "ja": "Japanese", "ko": "Korean", "ar": "Arabic", "ru": "Russian",
    "hi": "Hindi", "ta": "Tamil", "si": "Sinhala", "nl": "Dutch",
    "tr": "Turkish", "vi": "Vietnamese", "th": "Thai",
}


class TranslateRequest(BaseModel):
    text: str
    target: str  # language code e.g. "fr", "es"


class TranslateResponse(BaseModel):
    original: str
    translation: str
    detected_code: str
    detected_name: str
    target_code: str
    target_name: str


@app.post("/translate", response_model=TranslateResponse)
def translate(req: TranslateRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    # Detect source language
    try:
        detected_code = detect(req.text)
    except LangDetectException:
        detected_code = "unknown"

    detected_name = LANGUAGE_NAMES.get(detected_code.lower(), detected_code.upper())
    target_name = LANGUAGE_NAMES.get(req.target.lower(), req.target.upper())

    # Translate
    try:
        translator = GoogleTranslator(source="auto", target=req.target)
        result = translator.translate(req.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

    return TranslateResponse(
        original=req.text,
        translation=result,
        detected_code=detected_code,
        detected_name=detected_name,
        target_code=req.target,
        target_name=target_name,
    )


@app.get("/languages")
def get_languages():
    return [{"code": code, "name": name} for code, name in LANGUAGE_NAMES.items()]


@app.get("/")
def root():
    return {"message": "Translator API is running. POST to /translate"}
