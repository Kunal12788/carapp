import { GoogleGenAI } from "@google/genai";
import { Trip, Vehicle } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBusinessInsight = async (trips: Trip[], vehicles: Vehicle[]): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API Key not configured. Please add your Gemini API Key to enable insights.";

  const recentTrips = trips.slice(0, 10); // Analyze last 10 trips for performance
  
  // Prepare a concise summary for the model
  const dataSummary = JSON.stringify({
    totalTrips: trips.length,
    vehicles: vehicles.map(v => ({ reg: v.registrationNumber, nextService: v.nextServiceDueDate })),
    recentTripPerformance: recentTrips.map(t => ({
      date: t.date,
      profit: t.netProfit,
      efficiency: t.totalDistance > 0 ? (t.expenses.fuelCost / t.totalDistance).toFixed(2) : 0,
      notes: t.notes
    }))
  });

  const prompt = `
    Act as a business consultant for a travel agency. Analyze the following operational data (JSON).
    Provide 3 brief, bulleted, actionable insights regarding:
    1. Profitability trends or anomalies.
    2. Vehicle maintenance urgency.
    3. Operational efficiency (fuel cost per km).
    
    Keep it professional and concise.
    Data: ${dataSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights at this time.";
  }
};