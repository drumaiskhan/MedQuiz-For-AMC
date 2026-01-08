
import { GoogleGenAI, Type } from "@google/genai";
import { Category, ProfYear, Question, Difficulty } from "../types";

const QUESTION_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Array of exactly 5 unique strings (Options A-E)"
      },
      correctIndex: { type: Type.INTEGER },
      explanation: { 
        type: Type.STRING,
        description: "A detailed clinical explanation for why the answer is correct."
      }
    },
    required: ["question", "options", "correctIndex", "explanation"]
  }
};

export const generateMedicalQuiz = async (category: Category, year: ProfYear, difficulty: Difficulty, topic: string): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are a medical education expert. Generate 10-15 high-yield MCQs for ${category} ${year} level.
    Topic: ${topic}. Difficulty: ${difficulty}.
    Ensure questions focus on clinical scenarios and textbook accuracy.
    Format: 5 options (A, B, C, D, E).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a ${difficulty} medical quiz on ${topic} for ${year} ${category} students.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: QUESTION_SCHEMA
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const generateQuizFromFile = async (fileData: string, mimeType: string): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: fileData, mimeType: mimeType } },
          { text: "Extract medical MCQs from this document. Ensure each has 5 options and a clinical explanation." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: QUESTION_SCHEMA
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("File Extraction Error:", error);
    throw error;
  }
};
