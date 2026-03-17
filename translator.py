"""
Simple Language Translator
Uses deep-translator & langdetect
Install: pip install deep-translator langdetect
"""

from deep_translator import GoogleTranslator
from langdetect import detect, LangDetectException

LANGUAGE_NAMES = {
    "en": "English", "es": "Spanish", "fr": "French", "de": "German",
    "it": "Italian", "pt": "Portuguese", "zh-cn": "Chinese (Simplified)",
    "zh-tw": "Chinese (Traditional)", "ja": "Japanese", "ko": "Korean",
    "ar": "Arabic", "ru": "Russian", "hi": "Hindi", "ta": "Tamil",
    "si": "Sinhala", "nl": "Dutch", "sv": "Swedish", "pl": "Polish",
    "tr": "Turkish", "vi": "Vietnamese", "th": "Thai", "id": "Indonesian",
}

TARGET_ALIASES = {
    "english": "en", "spanish": "es", "french": "fr", "german": "de",
    "italian": "it", "portuguese": "pt", "chinese": "zh-CN",
    "japanese": "ja", "korean": "ko", "arabic": "ar", "russian": "ru",
    "hindi": "hi", "tamil": "ta", "sinhala": "si", "dutch": "nl",
    "swedish": "sv", "polish": "pl", "turkish": "tr", "vietnamese": "vi",
    "thai": "th", "indonesian": "id",
}


def get_language_name(code: str) -> str:
    return LANGUAGE_NAMES.get(code.lower(), code.upper())


def detect_language(text: str):
    try:
        code = detect(text)
        name = get_language_name(code)
        return code, name
    except LangDetectException:
        return None, "Unknown"


def translate(text: str, target: str, source: str = "auto") -> str:
    translator = GoogleTranslator(source=source, target=target)
    return translator.translate(text)


def resolve_target(user_input: str) -> str:
    """Convert a language name or code entered by the user to a language code."""
    cleaned = user_input.strip().lower()
    if cleaned in TARGET_ALIASES:
        return TARGET_ALIASES[cleaned]
    return user_input.strip()


# ✅ THIS IS THE IMPORTANT FUNCTION FOR FLASK
def translate_text(text, target):
    target_code = resolve_target(target)
    translated = translate(text, target=target_code)

    source_code, source_name = detect_language(text)
    target_name = get_language_name(target_code)

    return f"{source_name} → {target_name}: {translated}"


# (Optional) CLI mode - you can keep this
def run():
    print("=" * 55)
    print("         Smart Language Translator 🌍")
    print("=" * 55)

    while True:
        sentence = input("Enter sentence: ").strip()
        if sentence.lower() in ("quit", "exit", ""):
            print("Goodbye! 👋")
