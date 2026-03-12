import { getChatCompletion } from './aiIntegrations/chatCompletion';

const PROVIDER = 'ANTHROPIC';
const MODEL = 'claude-sonnet-4-5-20250929';

export const claudeMCQOptimizationService = {
  async generateQuestionSuggestions(electionTopic, existingQuestions = []) {
    try {
      const existingQText = existingQuestions?.slice(0, 5)?.map(q => `- ${q?.questionText || q?.text || ''}`)?.join('\n') || 'None';
      const messages = [
        {
          role: 'system',
          content: 'You are an expert MCQ question designer for voting and election platforms. Generate high-quality, engaging multiple choice questions that test voter knowledge and engagement. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: `Generate 5 new MCQ questions for the election topic: "${electionTopic}"\n\nExisting questions (avoid duplicates):\n${existingQText}\n\nRespond with JSON array:\n[{"questionText": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "difficulty": "medium", "explanation": "..."}]`
        }
      ];

      const response = await getChatCompletion(PROVIDER, MODEL, messages, { max_tokens: 2000, temperature: 0.7 });
      const content = response?.choices?.[0]?.message?.content || response;
      const jsonMatch = String(content)?.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        return { data: JSON.parse(jsonMatch?.[0]), error: null };
      }
      return { data: JSON.parse(String(content)), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to generate suggestions' } };
    }
  },

  async improveQuestionClarity(questions) {
    try {
      const questionsText = questions?.map((q, i) => `${i + 1}. ${q?.questionText || q?.text || ''}`)?.join('\n');
      const messages = [
        {
          role: 'system',
          content: 'You are an expert at improving MCQ question clarity and comprehension. Rewrite questions to be clearer, more precise, and easier to understand. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: `Improve the clarity of these MCQ questions:\n${questionsText}\n\nRespond with JSON array matching the input order:\n[{"originalQuestion": "...", "improvedQuestion": "...", "clarityScore": 85, "improvements": ["...", "..."]}]`
        }
      ];

      const response = await getChatCompletion(PROVIDER, MODEL, messages, { max_tokens: 2000, temperature: 0.5 });
      const content = response?.choices?.[0]?.message?.content || response;
      const jsonMatch = String(content)?.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        return { data: JSON.parse(jsonMatch?.[0]), error: null };
      }
      return { data: JSON.parse(String(content)), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to improve clarity' } };
    }
  },

  async generateAlternativeOptions(question, currentOptions) {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an expert at creating plausible distractor options for MCQ questions. Generate alternative answer options that are plausible but incorrect, to improve question difficulty and discrimination. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: `Question: "${question?.questionText || question?.text || ''}"\nCurrent options: ${JSON.stringify(currentOptions)}\n\nGenerate 3-5 alternative plausible distractor options that are NOT the correct answer.\n\nRespond with JSON:\n{"distractors": ["...", "...", "..."], "rationale": "...", "difficultyImpact": "increases/decreases/neutral"}`
        }
      ];

      const response = await getChatCompletion(PROVIDER, MODEL, messages, { max_tokens: 1000, temperature: 0.7 });
      const content = response?.choices?.[0]?.message?.content || response;
      const jsonMatch = String(content)?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return { data: JSON.parse(jsonMatch?.[0]), error: null };
      }
      return { data: JSON.parse(String(content)), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to generate alternatives' } };
    }
  },

  async getOptimizationRecommendations(lowPerformingQuestions) {
    try {
      const questionsData = lowPerformingQuestions?.map(q => ({
        question: q?.questionText || q?.text || '',
        accuracy: q?.accuracy || 0,
        options: q?.options || [],
        difficulty: q?.difficulty || 'medium'
      }));

      const messages = [
        {
          role: 'system',
          content: 'You are an MCQ optimization expert. Analyze low-performing questions and provide actionable recommendations to improve their effectiveness, clarity, and voter engagement. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: `Analyze these low-performing MCQ questions (accuracy < 40%) and provide optimization recommendations:\n${JSON.stringify(questionsData, null, 2)}\n\nRespond with JSON array:\n[{"questionIndex": 0, "issue": "...", "recommendation": "...", "rewrittenQuestion": "...", "priorityLevel": "high/medium/low", "expectedImprovementPercent": 25}]`
        }
      ];

      const response = await getChatCompletion(PROVIDER, MODEL, messages, { max_tokens: 3000, temperature: 0.6 });
      const content = response?.choices?.[0]?.message?.content || response;
      const jsonMatch = String(content)?.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        return { data: JSON.parse(jsonMatch?.[0]), error: null };
      }
      return { data: JSON.parse(String(content)), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to get recommendations' } };
    }
  },

  async analyzeSentiment(freeTextResponses) {
    try {
      const texts = freeTextResponses?.slice(0, 50)?.map(r => r?.answerText || r?.answer_text || '')?.filter(Boolean);
      if (!texts?.length) return { data: { sentiment: 'neutral', score: 0, themes: [], summary: 'No responses to analyze' }, error: null };

      const messages = [
        {
          role: 'system',
          content: 'You are a sentiment analysis expert specializing in voter feedback and MCQ free-text responses. Analyze sentiment and extract key themes. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: `Analyze the sentiment of these voter free-text MCQ responses:\n${texts?.map((t, i) => `${i + 1}. "${t}"`)?.join('\n')}\n\nRespond with JSON:\n{"overallSentiment": "positive/negative/neutral", "sentimentScore": 0.75, "positiveCount": 10, "negativeCount": 5, "neutralCount": 15, "themes": [{"theme": "...", "frequency": 5, "sentiment": "positive"}], "summary": "...", "keyInsights": ["...", "..."]}`
        }
      ];

      const response = await getChatCompletion(PROVIDER, MODEL, messages, { max_tokens: 1500, temperature: 0.3 });
      const content = response?.choices?.[0]?.message?.content || response;
      const jsonMatch = String(content)?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return { data: JSON.parse(jsonMatch?.[0]), error: null };
      }
      return { data: JSON.parse(String(content)), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Failed to analyze sentiment' } };
    }
  }
};

export default claudeMCQOptimizationService;
