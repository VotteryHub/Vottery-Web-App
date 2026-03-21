import claude from '../lib/claude';

export const contentQualityScoringService = {
  async scoreContent({ content, contentType = 'election' }) {
    if (!String(content || '').trim()) {
      return {
        data: null,
        error: 'Content is required for quality scoring.',
      };
    }

    try {
      const prompt = `You are a content quality analyst.
Score this ${contentType} content and return ONLY strict JSON with keys:
clarityScore (0-100), neutralityScore (0-100), engagementPrediction (0-100), suggestions (string[]), rewrittenVersion (string).

Content:
${content}`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = response?.content?.[0]?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

      if (!parsed) throw new Error('Failed to parse Claude response');

      return {
        data: {
          clarityScore: Number(parsed?.clarityScore ?? 0),
          neutralityScore: Number(parsed?.neutralityScore ?? 0),
          engagementPrediction: Number(parsed?.engagementPrediction ?? 0),
          suggestions: Array.isArray(parsed?.suggestions) ? parsed.suggestions : [],
          rewrittenVersion: parsed?.rewrittenVersion || content,
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error?.message || 'Unable to score content right now.',
      };
    }
  },
};
