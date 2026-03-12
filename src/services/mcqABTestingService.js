import { supabase } from '../lib/supabase';

export const mcqABTestingService = {
  async createTest(questionId, variantData) {
    try {
      const { data: test, error } = await supabase?.from('mcq_ab_test_variants')?.insert({
          question_id: questionId,
          variant_name: variantData?.variantName || 'Variant B',
          variant_type: variantData?.variantType || 'question_text',
          variant_question_text: variantData?.questionText,
          variant_options: variantData?.options ? JSON.stringify(variantData?.options) : null,
          variant_difficulty: variantData?.difficulty,
          variant_image_url: variantData?.imageUrl,
          status: 'active',
          created_at: new Date()?.toISOString(),
        })?.select()?.single();
      if (error) throw error;
      return { data: test, error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message } };
    }
  },

  async getTestsForQuestion(questionId) {
    try {
      const { data, error } = await supabase?.from('mcq_ab_test_variants')?.select('*')?.eq('question_id', questionId)?.order('created_at', { ascending: false });
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (e) {
      return { data: [], error: { message: e?.message } };
    }
  },

  async getAllTests() {
    try {
      const { data, error } = await supabase?.from('mcq_ab_test_variants')?.select('*, election_mcq_questions(question_text, election_id)')?.order('created_at', { ascending: false });
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (e) {
      return { data: [], error: { message: e?.message } };
    }
  },

  async recordResponse(variantId, questionId, voterId, isCorrect, responseTimeMs) {
    try {
      const { data, error } = await supabase?.from('mcq_ab_test_responses')?.insert({
          variant_id: variantId,
          question_id: questionId,
          voter_id: voterId,
          is_correct: isCorrect,
          response_time_ms: responseTimeMs,
          created_at: new Date()?.toISOString(),
        })?.select()?.single();
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message } };
    }
  },

  async getVariantMetrics(variantId) {
    try {
      const { data, error } = await supabase?.from('mcq_ab_test_responses')?.select('is_correct, response_time_ms')?.eq('variant_id', variantId);
      if (error) throw error;
      if (!data?.length) return { data: { total: 0, correct: 0, accuracy: 0, avgResponseTime: 0 }, error: null };
      const correct = data?.filter(r => r?.is_correct)?.length;
      const avgResponseTime = data?.reduce((sum, r) => sum + (r?.response_time_ms || 0), 0) / data?.length;
      return { data: { total: data?.length, correct, accuracy: (correct / data?.length) * 100, avgResponseTime }, error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message } };
    }
  },

  // Chi-squared test for statistical significance
  calculateChiSquared(controlMetrics, variantMetrics) {
    const { total: n1, correct: c1 } = controlMetrics;
    const { total: n2, correct: c2 } = variantMetrics;
    if (!n1 || !n2) return { chiSquared: 0, pValue: 1, significant: false };

    const f1 = c1, f2 = c2;
    const s1 = n1 - c1, s2 = n2 - c2;
    const total = n1 + n2;
    const totalCorrect = f1 + f2;
    const totalIncorrect = s1 + s2;

    const e11 = (n1 * totalCorrect) / total;
    const e12 = (n1 * totalIncorrect) / total;
    const e21 = (n2 * totalCorrect) / total;
    const e22 = (n2 * totalIncorrect) / total;

    const chiSquared =
      (e11 > 0 ? Math.pow(f1 - e11, 2) / e11 : 0) +
      (e12 > 0 ? Math.pow(s1 - e12, 2) / e12 : 0) +
      (e21 > 0 ? Math.pow(f2 - e21, 2) / e21 : 0) +
      (e22 > 0 ? Math.pow(s2 - e22, 2) / e22 : 0);

    // Approximate p-value for chi-squared with 1 df
    const pValue = chiSquared > 10.83 ? 0.001 : chiSquared > 6.63 ? 0.01 : chiSquared > 3.84 ? 0.05 : 1;
    return { chiSquared: Number(chiSquared?.toFixed(4)), pValue, significant: pValue < 0.05 };
  },

  /** Check statistical significance and auto-promote winner when p < 0.05 and min sample size met */
  async checkAndAutoPromoteWinner(questionId, minSampleSize = 100) {
    try {
      const { data: variants } = await supabase?.from('mcq_ab_test_variants')?.select('*')?.eq('question_id', questionId)?.eq('status', 'active');
      if (!variants?.length) return { data: { autoPromoted: false }, error: null };

      const control = variants?.find(v => v?.variant_name?.toLowerCase()?.includes('control') || v?.id === variants?.[0]?.id) || variants?.[0];
      const variantB = variants?.find(v => v?.id !== control?.id);
      if (!variantB) return { data: { autoPromoted: false }, error: null };

      const [controlMetrics, variantMetrics] = await Promise.all([
        this.getVariantMetrics(control?.id),
        this.getVariantMetrics(variantB?.id)
      ]);
      if (controlMetrics?.error || variantMetrics?.error) return { data: null, error: { message: 'Failed to fetch metrics' } };

      const c = controlMetrics?.data;
      const v = variantMetrics?.data;
      if (!c?.total || !v?.total || c?.total < minSampleSize || v?.total < minSampleSize) {
        return { data: { autoPromoted: false, reason: 'insufficient_sample' }, error: null };
      }

      const { significant, pValue } = this.calculateChiSquared(c, v);
      if (!significant) return { data: { autoPromoted: false, reason: 'not_significant', pValue }, error: null };

      const winnerId = v?.accuracy > c?.accuracy ? variantB?.id : control?.id;
      const { data: promoted, error } = await this.promoteWinner(winnerId, questionId);
      return { data: { autoPromoted: !!promoted?.promoted, pValue, winnerId }, error };
    } catch (e) {
      return { data: null, error: { message: e?.message } };
    }
  },

  async promoteWinner(variantId, questionId) {
    try {
      const { data: variant } = await supabase?.from('mcq_ab_test_variants')?.select('*')?.eq('id', variantId)?.single();
      if (!variant) throw new Error('Variant not found');

      const updates = {};
      if (variant?.variant_question_text) updates.question_text = variant?.variant_question_text;
      if (variant?.variant_options) updates.options = variant?.variant_options;
      if (variant?.variant_difficulty) updates.difficulty = variant?.variant_difficulty;

      const { error: updateError } = await supabase?.from('election_mcq_questions')?.update(updates)?.eq('id', questionId);
      if (updateError) throw updateError;

      await supabase?.from('mcq_ab_test_variants')?.update({ status: 'winner', promoted_at: new Date()?.toISOString() })?.eq('id', variantId);

      return { data: { promoted: true }, error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message } };
    }
  },
};

export default mcqABTestingService;
