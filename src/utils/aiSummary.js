import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "./logger.js";

export const buildUserSummarizationPrompt = (users) => {
    const formattedProfiles = users
        .map((user, i) => {
            return `
  User ${i + 1}:
  Username: ${user.username}
  Name: ${user.name || "N/A"}
  Bio: ${user.bio || "N/A"}
  Location: ${user.location || "N/A"}
  Profile URL: ${user.profileUrl || "N/A"}
  Pinned Repositories: ${user.pinnedRepos?.join(", ") || "N/A"}
  Contribution Count: ${user.contributions || "N/A"}`;
        })
        .join("\n\n");

    return `
  You are an expert software engineer assistant.
  
  Below are several GitHub user profiles. For each user, analyze their bio, pinned repositories, and contribution count, etc. to infer and summarize the following fields in strict JSON format:
  
  [
    {
      "username": "",
      "primarySkills": [],
      "techStack": [],
      "notableContributions": "",
      "experienceLevel": "",
      "summary": ""
    },
    ...
  ]
  
  Only return a JSON array. Do not add any explanation or notes.
  
  Here is the data:
  ${formattedProfiles}
  `.trim();
};

function cleanAIResponse(text) {
    return text
        .trim()
        .replace(/^```json\s*/, "")
        .replace(/^```\s*/, "")
        .replace(/```$/, "")
        .trim();
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getAISummary = async (users) => {
    logger.info("Getting AI summary for users:", users);
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
        });

        const prompt = buildUserSummarizationPrompt(users);
        const result = await model.generateContent(prompt);
        let text = result.response.text();

        text = cleanAIResponse(text);

        try {
            const json = JSON.parse(text);
            logger.info("Parsed AI response");
            return json;
        } catch (e) {
            logger.error("Failed to parse Gemini response as JSON. Err:", e);
            logger.info("Returning raw AI response:", text);
            return text;
        }
    } catch (error) {
        console.error("Error generating AI summary:", error);
        throw error;
    }
};
