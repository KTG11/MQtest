/**
 * Upload an image to Google Gemini API and analyze it.
 *
 * Requirements:
 * 1. Run `npm install form-data node-fetch`
 * 2. Set your Gemini API key below.
 */

import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";

const GEMINI_API_KEY = "YOUR_API_KEY_HERE"; // 🔑 Replace this
const IMAGE_PATH = "./image.jpg"; // 🖼️ Replace with your image file

// Upload the image to Gemini Files API
async function uploadImage() {
  const form = new FormData();
  form.append("file", fs.createReadStream(IMAGE_PATH));
  form.append("purpose", "gemini");

  const res = await fetch("https://generativelanguage.googleapis.com/upload/v1/files", {
    method: "POST",
    headers: { "Authorization": `Bearer ${GEMINI_API_KEY}` },
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload failed: ${errText}`);
  }

  const data = await res.json();
  console.log("✅ Image uploaded:", data);
  return data.file.name; // file name/id reference
}

// Generate content using the uploaded image
async function analyzeImage(fileName) {
  const body = {
    contents: [
      {
        parts: [
          { text: "Describe the contents of this image:" },
          { fileData: { fileUri: `gs://${fileName}` } }
        ]
      }
    ]
  };

  const res = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GEMINI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Generate failed: ${errText}`);
  }

  const data = await res.json();
  console.log("🧠 Gemini output:\n", data.candidates[0].content.parts[0].text);
}

(async () => {
  try {
    const fileName = await uploadImage();
    await analyzeImage(fileName);
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();