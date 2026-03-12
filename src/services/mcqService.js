import { supabase } from '../lib/supabase';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toSnakeCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const snakeKey = key?.replace(/[A-Z]/g, letter => `_${letter?.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj?.[key]);
    return acc;
  }, {});
};

const normalizeQuestion = (q) => {
  if (!q) return q;
  const camel = toCamelCase(q);
  return {
    ...camel,
    questionText: camel?.questionText || camel?.text || '',
    correctAnswer: typeof camel?.correctAnswer === 'number'
      ? (camel?.options?.[camel?.correctAnswer] || '')
      : (camel?.correctAnswer || ''),
    questionType: camel?.questionType || 'multiple_choice',
    difficulty: camel?.difficulty || 'medium',
    isRequired: camel?.isRequired ?? camel?.isMandatory ?? true,
    questionImageUrl: camel?.questionImageUrl || null,
    charLimit: camel?.charLimit || 500,
  };
};

export const mcqService = {
  async getMCQQuestions(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('election_mcq_questions')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.order('question_order', { ascending: true });
      if (error) throw error;
      const normalized = (data || [])?.map(normalizeQuestion);
      return { data: normalized, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async submitMCQResponse(electionId, userId, answers, score) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      const resolvedUserId = userId || user?.id;
      if (!resolvedUserId) throw new Error('Not authenticated');

      const responseRows = Object.entries(answers || {})?.map(([questionId, selectedAnswer]) => ({
        election_id: electionId,
        voter_id: resolvedUserId,
        question_id: questionId,
        selected_answer: typeof selectedAnswer === 'string' ? selectedAnswer : JSON.stringify(selectedAnswer),
        is_correct: null
      }));

      if (responseRows?.length === 0) {
        return { data: { score }, error: null };
      }

      const { data, error } = await supabase
        ?.from('voter_mcq_responses')
        ?.upsert(responseRows, { onConflict: 'election_id,voter_id,question_id' })
        ?.select();

      if (error) throw error;
      return { data: { responses: toCamelCase(data), score }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async submitFreeTextAnswer(electionId, questionId, answerText) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('voter_free_text_responses')
        ?.upsert({
          election_id: electionId,
          question_id: questionId,
          voter_id: user?.id,
          answer_text: answerText,
          submitted_at: new Date()?.toISOString()
        }, { onConflict: 'election_id,voter_id,question_id' })
        ?.select();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async calculateMCQScore(voterId, electionId, attemptNumber) {
    try {
      const { data, error } = await supabase
        ?.rpc('calculate_mcq_score', {
          p_voter_id: voterId,
          p_election_id: electionId,
          p_attempt_number: attemptNumber
        });
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async recordMCQAttempt(electionId, attemptNumber, scorePercentage, passed) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('voter_mcq_attempts')
        ?.insert({
          election_id: electionId,
          voter_id: user?.id,
          attempt_number: attemptNumber,
          score_percentage: scorePercentage,
          passed: passed,
          attempted_at: new Date()?.toISOString()
        })
        ?.select();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getVoterAttempts(electionId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('voter_mcq_attempts')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.eq('voter_id', user?.id)
        ?.order('attempt_number', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data || []), error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async checkMCQCompletion(electionId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        ?.rpc('check_mcq_completion', { p_election_id: electionId, p_user_id: user?.id });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: false, error: { message: error?.message } };
    }
  },

  async getUserMCQResponses(electionId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        ?.from('voter_mcq_responses')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.eq('voter_id', user?.id);
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createMCQQuestions(electionId, questions) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const questionsData = questions?.map((q, index) => ({
        election_id: electionId,
        question_text: q?.questionText || q?.text || '',
        question_order: index,
        options: q?.options,
        correct_answer: typeof q?.correctAnswer === 'number'
          ? (q?.options?.[q?.correctAnswer] || '')
          : (q?.correctAnswer || ''),
        is_mandatory: q?.isMandatory ?? true,
        question_type: q?.questionType || 'multiple_choice',
        difficulty: q?.difficulty || 'medium',
        is_required: q?.isRequired ?? true,
        question_image_url: q?.questionImageUrl || null,
        char_limit: q?.charLimit || 500,
      }));

      const { data, error } = await supabase
        ?.from('election_mcq_questions')
        ?.insert(questionsData)
        ?.select();

      if (error) throw error;
      return { data: (data || [])?.map(normalizeQuestion), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async deleteMCQQuestion(questionId) {
    try {
      const { error } = await supabase
        ?.from('election_mcq_questions')
        ?.delete()
        ?.eq('id', questionId);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async getMCQAnalytics(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('voter_mcq_responses')
        ?.select('question_id, selected_answer, is_correct')
        ?.eq('election_id', electionId);
      if (error) throw error;

      const analytics = {};
      (data || [])?.forEach(row => {
        if (!analytics?.[row?.question_id]) {
          analytics[row?.question_id] = { total: 0, correct: 0, answerDistribution: {} };
        }
        analytics[row?.question_id].total++;
        if (row?.is_correct) analytics[row?.question_id].correct++;
        const ans = row?.selected_answer || 'No answer';
        analytics[row?.question_id].answerDistribution[ans] = (analytics?.[row?.question_id]?.answerDistribution?.[ans] || 0) + 1;
      });

      return { data: analytics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getFreeTextAnalytics(electionId) {
    try {
      const { data, error } = await supabase
        ?.rpc('get_free_text_analytics', { p_election_id: electionId });
      if (error) {
        // Fallback: fetch raw data
        const { data: rawData, error: rawError } = await supabase
          ?.from('voter_free_text_responses')
          ?.select('*')
          ?.eq('election_id', electionId);
        if (rawError) throw rawError;
        return { data: toCamelCase(rawData || []), error: null };
      }
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async exportFreeTextAnswersToCSV(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('voter_free_text_responses')
        ?.select('*')
        ?.eq('election_id', electionId);
      if (error) throw error;

      const rows = (data || [])?.map(r => ({
        question_id: r?.question_id,
        voter_id: r?.voter_id,
        answer_text: r?.answer_text,
        submitted_at: r?.submitted_at
      }));

      const headers = ['question_id', 'voter_id', 'answer_text', 'submitted_at'];
      const csvContent = [
        headers?.join(','),
        ...rows?.map(row => headers?.map(h => `"${(row?.[h] || '')?.toString()?.replace(/"/g, '""')}"`)?.join(','))
      ]?.join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `free_text_answers_${electionId}.csv`;
      a?.click();
      URL.revokeObjectURL(url);
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async exportFreeTextAnswersToJSON(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('voter_free_text_responses')
        ?.select('*')
        ?.eq('election_id', electionId);
      if (error) throw error;

      const jsonContent = JSON.stringify(data || [], null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `free_text_answers_${electionId}.json`;
      a?.click();
      URL.revokeObjectURL(url);
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async exportImageGallery(electionId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: questions } = await supabase
        ?.from('election_mcq_questions')
        ?.select('id, question_text, question_image_url')
        ?.eq('election_id', electionId);

      const { data: optionImages } = await supabase
        ?.from('mcq_option_image_metadata')
        ?.select('*')
        ?.eq('election_id', electionId);

      const exportData = {
        election_id: electionId,
        exported_at: new Date()?.toISOString(),
        question_images: (questions || [])?.filter(q => q?.question_image_url),
        option_images: optionImages || []
      };

      const { error: insertError } = await supabase
        ?.from('mcq_image_gallery_exports')
        ?.insert({
          election_id: electionId,
          exported_by: user?.id,
          export_data: exportData,
          exported_at: new Date()?.toISOString()
        });

      if (insertError) console.warn('Export record insert failed:', insertError?.message);

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image_gallery_${electionId}.json`;
      a?.click();
      URL.revokeObjectURL(url);
      return { data: exportData, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async uploadOptionImage(file, electionId, questionId, optionIndex, altText) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${electionId}/${questionId}/option_${optionIndex}_${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase?.storage
        ?.from('election-media')
        ?.upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase?.storage
        ?.from('election-media')
        ?.getPublicUrl(fileName);

      const { error: metaError } = await supabase
        ?.from('mcq_option_image_metadata')
        ?.upsert({
          election_id: electionId,
          question_id: questionId,
          option_index: optionIndex,
          image_url: publicUrl,
          alt_text: altText || '',
          uploaded_by: user?.id,
          uploaded_at: new Date()?.toISOString()
        }, { onConflict: 'election_id,question_id,option_index' });

      if (metaError) console.warn('Metadata insert failed:', metaError?.message);

      return { data: { publicUrl, fileName }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async uploadQuestionImage(file, electionId, questionId) {
    try {
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${electionId}/${questionId}/question_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase?.storage
        ?.from('election-media')
        ?.upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase?.storage
        ?.from('election-media')
        ?.getPublicUrl(fileName);

      return { data: { publicUrl }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createLiveQuestionInjection(electionId, question, scheduledFor) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('live_question_injection_queue')
        ?.insert({
          election_id: electionId,
          question_text: question?.questionText || '',
          options: question?.options || [],
          correct_answer: question?.correctAnswer || '',
          question_type: question?.questionType || 'multiple_choice',
          scheduled_for: scheduledFor || new Date()?.toISOString(),
          status: 'pending',
          created_by: user?.id,
          created_at: new Date()?.toISOString()
        })
        ?.select();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async broadcastLiveQuestion(injectionId) {
    try {
      const { data, error } = await supabase
        ?.rpc('broadcast_live_question', { p_injection_id: injectionId });
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  streamLiveQuestions(electionId, onNewQuestion) {
    const channel = supabase
      ?.channel(`live_questions_${electionId}`)
      ?.on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'live_question_broadcasts',
        filter: `election_id=eq.${electionId}`
      }, (payload) => {
        onNewQuestion?.(toCamelCase(payload?.new));
      })
      ?.subscribe();

    return () => supabase?.removeChannel(channel);
  },

  async getLiveQuestionInjectionQueue(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('live_question_injection_queue')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.order('created_at', { ascending: false });
      if (error) throw error;
      return { data: toCamelCase(data || []), error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async getLiveQuestionBroadcastAnalytics(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('live_question_response_analytics')
        ?.select('*')
        ?.eq('election_id', electionId);
      if (error) throw error;
      return { data: toCamelCase(data || []), error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async getOptionImageMetadata(electionId, questionId) {
    try {
      const { data, error } = await supabase
        ?.from('mcq_option_image_metadata')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.eq('question_id', questionId);
      if (error) throw error;
      return { data: toCamelCase(data || []), error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  }
};

export default mcqService;