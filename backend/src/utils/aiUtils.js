import fetch from "node-fetch";
import AbortController from "abort-controller";

export async function getPrioritySuggestion(title, description, deadline) {
  const HF_API_TOKEN = process.env.HF_API_TOKEN;
  const model = "valhalla/distilbart-mnli-12-1";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1000); // 1 seconds

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Title: ${title}\nDescription: ${description}`,
          parameters: {
            candidate_labels: ["high", "medium", "low"],
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      console.error("[HF API Error]", await response.text());
      return fallbackPriority(title, description, deadline);
    }

    const data = await response.json();
    console.log("[HF Response Raw]", JSON.stringify(data, null, 2));

    const labels = data?.labels || [];
    const scores = data?.scores || [];

    const highIndex = labels.indexOf("high");
    if (highIndex !== -1 && scores[highIndex] > 0.45) {
      return "high";
    }

    return labels[0] || "medium";
  } catch (error) {
    console.error("[HF API Exception]", error.message);
    clearTimeout(timeout);
    return fallbackPriority(title, description, deadline);
  }
}

// fallback local logic when API fails
function fallbackPriority(title, description, deadline) {
  const text = `${title} ${description}`.toLowerCase();
  const highKeywords = [
    "urgent",
    "critical",
    "today",
    "immediately",
    "now",
    "final day",
    "last day",
    "deadline",
    "asap",
  ];

  if (highKeywords.some((kw) => text.includes(kw))) {
    console.log("[Fallback Priority] Classified as HIGH");
    return "high";
  }

  console.log("[Fallback Priority] Classified as LOW 1 ", deadline);
  if (deadline) {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffInDays = (deadlineDate - now) / (1000 * 60 * 60 * 24);

    console.log("[Fallback Priority] Classified as LOW ", diffInDays);
    if (diffInDays > 7) {
      console.log("[Fallback Priority] Classified as LOW (deadline > 7 days)");
      return "low";
    }
  }

  console.log("[Fallback Priority] Classified as MEDIUM");
  return "medium";
}
