from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Allow frontend to access backend
from google import genai
from google.genai import types
import io
import os

# --- Flask Setup ---
app = Flask(__name__)
CORS(app)  # ✅ Enables CORS for all routes

# --- Gemini Client Setup ---
client = genai.Client(api_key=os.environ.get("AIzaSyDlD417WYcttYZfn3PpXIu3e6F2VNIIDnIY"))
  # 🔒 Replace with env var in production
model = "gemini-2.5-flash"

# --- System Instruction (you can expand this) ---
system_instruction = types.Part.from_text(text="""

make sure the chat is age restricted according to these details.
You are now in Study Mode.
Act as my personal study coach.
Always keep your responses clear, structured, and focused on helping me understand deeply rather than just memorize or get a straight answer.
Ask me questions to check my understanding before moving on.
pls don't add symbols that aren't related to the mathematics questions such as $ and ** and \\


""")

@app.route('/solve', methods=['POST'])
def solve_math_question():
    """
    Accepts:
      - Multipart form with optional 'question' (text) and 'image' (file)
      - Returns JSON with 'response'
    """

    try:
        contents = []

        # --- Handle text question ---
        user_question = request.form.get('question') or (
            request.get_json().get('question') if request.is_json else None
        )

        if not user_question and 'image' not in request.files:
            return jsonify({'error': 'Please provide a question or upload an image.'}), 400

        if user_question:
            contents.append(
                types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=user_question)]
                )
            )

        # --- Handle optional image ---
        if 'image' in request.files:
            image_file = request.files['image']
            image_bytes = image_file.read()

            contents.append(
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_data(
                            mime_type=image_file.content_type,
                            data=image_bytes
                        )
                    ]
                )
            )

        # --- Model config ---
        generate_content_config = types.GenerateContentConfig(
            temperature=0.6,
            system_instruction=[system_instruction],
        )

        # --- Generate the model response ---
        response_text = ""
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            if hasattr(chunk, "text") and chunk.text:
                response_text += chunk.text

        if not response_text.strip():
            return jsonify({'error': 'Empty response from model.'}), 500

        return jsonify({'response': response_text.strip()}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500
    

@app.route('/')
def home():
    return '''
        <h2>🚀 MathMentor API is Running!</h2>
        <p>Welcome to the MathMentor backend powered by Flask + Gemini AI.</p>
        <p>Use <code>/solve</code> to send math questions via POST requests.</p>
    '''




if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
