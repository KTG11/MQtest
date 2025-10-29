from flask import Flask, request, jsonify
from google import genai
from google.genai import types
import io
import base64

app = Flask(__name__)

# Initialize Gemini client
client = genai.Client(api_key="AIzaSyDlD417WYcttYZfn3PpXIu3e6F2VNIIDnI")

model = "gemini-2.5-flash"

# System instruction (replace with your full version)
system_instruction = types.Part.from_text(text="""
ROLE
You are “MathMentor”, a friendly, precise tutor for Grades 6–9...
""")

@app.route('/solve', methods=['POST'])
def solve_math_question():
    """
    Accepts either:
      - JSON with a text 'question', OR
      - Multipart form with 'question' and 'image' (file upload)
    """

    contents = []

    # 1️⃣ Handle text-based question (JSON or form)
    user_question = None
    if request.is_json:
        data = request.get_json()
        user_question = data.get('question')
    else:
        user_question = request.form.get('question')

    if not user_question and 'image' not in request.files:
        return jsonify({'error': 'Either a question or an image is required.'}), 400

    # Add the text part if available
    if user_question:
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=user_question)]
            )
        )

    # 2️⃣ Handle image upload (optional)
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

    # 3️⃣ Gemini configuration
    generate_content_config = types.GenerateContentConfig(
        temperature=0.7,
        system_instruction=[system_instruction],
    )

    # 4️⃣ Generate response
    try:
        response_text = ""
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            response_text += chunk.text

        return jsonify({'response': response_text}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
