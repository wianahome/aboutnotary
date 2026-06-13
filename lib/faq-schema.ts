export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqPageJsonLd {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

const QUESTION_TAG_PATTERN = /<(h3|strong)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
const ANSWER_PARAGRAPH_PATTERN = /<p(\s[^>]*)?>([\s\S]*?)<\/p>/i;

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ");
}

export function stripHtml(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function normalizeQuestionText(text: string): string {
  return text.replace(/^Q:\s*/i, "").trim();
}

function isQuestionCandidate(text: string): boolean {
  const normalized = text.trim();

  if (normalized.length === 0) {
    return false;
  }

  if (/^Q:\s*/i.test(normalized)) {
    return true;
  }

  if (normalized.includes("?")) {
    return true;
  }

  return false;
}

function extractAnswerAfterQuestion(
  html: string,
  questionEndIndex: number,
): string | null {
  const contentAfterQuestion = html.slice(questionEndIndex);
  const answerMatch = contentAfterQuestion.match(ANSWER_PARAGRAPH_PATTERN);

  if (!answerMatch) {
    return null;
  }

  const answerText = stripHtml(answerMatch[2]);

  return answerText.length > 0 ? answerText : null;
}

/**
 * Scans raw article HTML for FAQ pairs:
 * - `<h3>` or `<strong>` tags containing "?" or starting with "Q:"
 * - The immediately following `<p>` tag as the answer
 */
export function extractFaqsFromHtml(html: string): FaqItem[] {
  if (!html || html.trim().length === 0) {
    return [];
  }

  const faqs: FaqItem[] = [];
  const seenQuestions = new Set<string>();

  for (const match of html.matchAll(QUESTION_TAG_PATTERN)) {
    const fullMatch = match[0];
    const questionInnerHtml = match[3] ?? "";
    const questionText = stripHtml(questionInnerHtml);

    if (!isQuestionCandidate(questionText)) {
      continue;
    }

    const normalizedQuestion = normalizeQuestionText(questionText);

    if (normalizedQuestion.length === 0) {
      continue;
    }

    const questionKey = normalizedQuestion.toLowerCase();
    if (seenQuestions.has(questionKey)) {
      continue;
    }

    const questionEndIndex = (match.index ?? 0) + fullMatch.length;
    const answer = extractAnswerAfterQuestion(html, questionEndIndex);

    if (!answer) {
      continue;
    }

    seenQuestions.add(questionKey);
    faqs.push({
      question: normalizedQuestion,
      answer,
    });
  }

  return faqs;
}

export function buildFaqPageSchema(faqs: FaqItem[]): FaqPageJsonLd | null {
  if (faqs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildFaqPageSchemaFromHtml(html: string): FaqPageJsonLd | null {
  return buildFaqPageSchema(extractFaqsFromHtml(html));
}

export function serializeFaqPageSchema(schema: FaqPageJsonLd): string {
  return JSON.stringify(schema);
}
