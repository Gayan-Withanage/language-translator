from flask import Flask, request, jsonify, render_template
from translator import translate_text, LANGUAGE_NAMES
import os


app = Flask(__name__)


# ✅ Home page
@app.route('/')
def home():
    return render_template('index.html')


# ✅ Get all available languages (for dropdown)
@app.route('/languages', methods=['GET'])
def get_languages():
    return jsonify(LANGUAGE_NAMES)


# ✅ Translate API
@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()

        text = data.get('text')
        target = data.get('target')

        # Validation
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        if not target:
            return jsonify({'error': 'Target language is required'}), 400

        # Call translator
        result = translate_text(text, target)

        return jsonify({'translated_text': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ✅ Run server
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
