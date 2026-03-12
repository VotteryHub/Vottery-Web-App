import { supabase } from '../lib/supabase';
import { votesService } from './votesService';
import { electionsService } from './electionsService';


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

export const gamifiedAPIService = {
  // API Endpoint: POST /api/gamified/create
  async createGamified(gamifiedData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Authentication required');

      // Log API request
      await this.logAPIRequest('POST', '/api/gamified/create', user?.id, gamifiedData);

      // Create election with gamified configuration
      const electionResult = await electionsService?.create({
        ...gamifiedData,
        isGamified: true,
        gamifiedConfig: {
          prizePool: gamifiedData?.prizePool,
          numberOfWinners: gamifiedData?.numberOfWinners,
          drawDate: gamifiedData?.drawDate
        }
      });

      if (electionResult?.error) throw electionResult?.error;

      // Log successful response
      await this.logAPIResponse('POST', '/api/gamified/create', 201, electionResult?.data);

      return {
        success: true,
        data: electionResult?.data,
        message: 'Gamified election created successfully'
      };
    } catch (error) {
      await this.logAPIResponse('POST', '/api/gamified/create', 500, null, error?.message);
      return {
        success: false,
        error: error?.message
      };
    }
  },

  // API Endpoint: POST /api/gamified/participate
  async participateInGamified(participationData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Authentication required');

      await this.logAPIRequest('POST', '/api/gamified/participate', user?.id, participationData);

      // Cast vote (automatically generates gamified ticket)
      const voteResult = await votesService?.castVote({
        electionId: participationData?.electionId,
        selectedOptionId: participationData?.selectedOptionId,
        rankedChoices: participationData?.rankedChoices,
        selectedOptions: participationData?.selectedOptions,
        isGamified: true
      });

      if (voteResult?.error) throw voteResult?.error;

      await this.logAPIResponse('POST', '/api/gamified/participate', 201, voteResult?.data);

      return {
        success: true,
        data: {
          ticketId: voteResult?.data?.gamifiedTicketId,
          voteId: voteResult?.data?.id,
          blockchainHash: voteResult?.data?.blockchainHash
        },
        message: 'Gamified ticket generated successfully'
      };
    } catch (error) {
      await this.logAPIResponse('POST', '/api/gamified/participate', 500, null, error?.message);
      return {
        success: false,
        error: error?.message
      };
    }
  },

  // API Endpoint: GET /api/gamified/results/:electionId
  async getGamifiedResults(electionId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      await this.logAPIRequest('GET', `/api/gamified/results/${electionId}`, user?.id);

      // Get election results
      const { data: election, error: electionError } = await supabase
        ?.from('elections')
        ?.select('*, election_options(*)')
        ?.eq('id', electionId)
        ?.single();

      if (electionError) throw electionError;

      // Get prize distributions
      const { data: prizeDistributions, error: prizeError } = await supabase
        ?.from('prize_distributions')
        ?.select(`
          *,
          winner:user_profiles!prize_distributions_winner_id_fkey(*),
          vote:votes(*)
        `)
        ?.eq('election_id', electionId)
        ?.order('created_at', { ascending: false });

      if (prizeError) throw prizeError;

      await this.logAPIResponse('GET', `/api/gamified/results/${electionId}`, 200, { election, prizeDistributions });

      return {
        success: true,
        data: {
          election: toCamelCase(election),
          winners: toCamelCase(prizeDistributions),
          totalPrizePool: election?.prize_pool,
          drawDate: election?.end_date
        }
      };
    } catch (error) {
      await this.logAPIResponse('GET', `/api/gamified/results/${electionId}`, 500, null, error?.message);
      return {
        success: false,
        error: error?.message
      };
    }
  },

  // API Endpoint: POST /api/gamified/draw
  async initiateDraw(electionId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Authentication required');

      await this.logAPIRequest('POST', '/api/gamified/draw', user?.id, { electionId });

      // Call select_gamified_winners function
      const { data, error } = await supabase
        ?.rpc('select_gamified_winners', { p_election_id: electionId });

      if (error) throw error;

      await this.logAPIResponse('POST', '/api/gamified/draw', 200, data);

      return {
        success: true,
        data: toCamelCase(data),
        message: 'Gamified draw completed successfully'
      };
    } catch (error) {
      await this.logAPIResponse('POST', '/api/gamified/draw', 500, null, error?.message);
      return {
        success: false,
        error: error?.message
      };
    }
  },

  // API Endpoint: GET /api/gamified/verify/:ticketId
  async verifyTicket(ticketId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      await this.logAPIRequest('GET', `/api/gamified/verify/${ticketId}`, user?.id);

      const { data: vote, error } = await supabase
        ?.from('votes')
        ?.select(`
          *,
          election:elections(*),
          prize_distribution:prize_distributions(*)
        `)
        ?.eq('gamified_ticket_id', ticketId)
        ?.single();

      if (error) throw error;

      await this.logAPIResponse('GET', `/api/gamified/verify/${ticketId}`, 200, vote);

      return {
        success: true,
        data: {
          ticketId: vote?.gamified_ticket_id,
          valid: true,
          electionId: vote?.election_id,
          voteHash: vote?.vote_hash,
          blockchainHash: vote?.blockchain_hash,
          winner: vote?.prize_distribution ? true : false
        }
      };
    } catch (error) {
      await this.logAPIResponse('GET', `/api/gamified/verify/${ticketId}`, 404, null, error?.message);
      return {
        success: false,
        error: 'Ticket not found'
      };
    }
  },

  // API Endpoint: GET /api/gamified/payouts/:userId
  async getUserPayouts(userId) {
    try {
      await this.logAPIRequest('GET', `/api/gamified/payouts/${userId}`, userId);

      const { data: payouts, error } = await supabase
        ?.from('prize_distributions')
        ?.select(`
          *,
          election:elections(*),
          vote:votes(*)
        `)
        ?.eq('winner_id', userId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      await this.logAPIResponse('GET', `/api/gamified/payouts/${userId}`, 200, payouts);

      return {
        success: true,
        data: toCamelCase(payouts)
      };
    } catch (error) {
      await this.logAPIResponse('GET', `/api/gamified/payouts/${userId}`, 500, null, error?.message);
      return {
        success: false,
        error: error?.message
      };
    }
  },

  // API Endpoint: GET /api/audit/logs
  async getAuditLogs(filters = {}) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Authentication required');

      await this.logAPIRequest('GET', '/api/audit/logs', user?.id, filters);

      let query = supabase
        ?.from('api_request_logs')
        ?.select('*')
        ?.order('timestamp', { ascending: false })
        ?.limit(filters?.limit || 100);

      if (filters?.endpoint) {
        query = query?.eq('endpoint', filters?.endpoint);
      }

      if (filters?.method) {
        query = query?.eq('method', filters?.method);
      }

      if (filters?.startDate) {
        query = query?.gte('timestamp', filters?.startDate);
      }

      const { data: logs, error } = await query;

      if (error) throw error;

      await this.logAPIResponse('GET', '/api/audit/logs', 200, logs);

      return {
        success: true,
        data: toCamelCase(logs)
      };
    } catch (error) {
      await this.logAPIResponse('GET', '/api/audit/logs', 500, null, error?.message);
      return {
        success: false,
        error: error?.message
      };
    }
  },

  // Get API statistics
  async getAPIStatistics() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Authentication required');

      const { data: stats, error } = await supabase
        ?.from('api_request_logs')
        ?.select('method, endpoint, status_code, response_time')
        ?.gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString());

      if (error) throw error;

      const statistics = {
        totalRequests: stats?.length,
        successRate: (stats?.filter(s => s?.status_code < 400)?.length / stats?.length * 100)?.toFixed(2),
        averageResponseTime: (stats?.reduce((sum, s) => sum + (s?.response_time || 0), 0) / stats?.length)?.toFixed(2),
        endpointBreakdown: this.groupByEndpoint(stats),
        errorRate: (stats?.filter(s => s?.status_code >= 400)?.length / stats?.length * 100)?.toFixed(2)
      };

      return {
        success: true,
        data: statistics
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message
      };
    }
  },

  // Helper: Log API request
  async logAPIRequest(method, endpoint, userId, requestBody = null) {
    try {
      await supabase?.from('api_request_logs')?.insert({
        method,
        endpoint,
        user_id: userId,
        request_body: requestBody,
        timestamp: new Date()?.toISOString()
      });
    } catch (error) {
      console.error('Failed to log API request:', error);
    }
  },

  // Helper: Log API response
  async logAPIResponse(method, endpoint, statusCode, responseData = null, errorMessage = null) {
    try {
      const { data: latestLog } = await supabase
        ?.from('api_request_logs')
        ?.select('*')
        ?.eq('method', method)
        ?.eq('endpoint', endpoint)
        ?.order('timestamp', { ascending: false })
        ?.limit(1)
        ?.single();

      if (latestLog) {
        const responseTime = Date.now() - new Date(latestLog?.timestamp)?.getTime();
        await supabase
          ?.from('api_request_logs')
          ?.update({
            status_code: statusCode,
            response_body: responseData,
            error_message: errorMessage,
            response_time: responseTime
          })
          ?.eq('id', latestLog?.id);
      }
    } catch (error) {
      console.error('Failed to log API response:', error);
    }
  },

  // Helper: Group statistics by endpoint
  groupByEndpoint(stats) {
    const grouped = {};
    stats?.forEach(stat => {
      if (!grouped?.[stat?.endpoint]) {
        grouped[stat?.endpoint] = {
          count: 0,
          successCount: 0,
          errorCount: 0,
          totalResponseTime: 0
        };
      }
      grouped[stat?.endpoint].count++;
      if (stat?.status_code < 400) {
        grouped[stat?.endpoint].successCount++;
      } else {
        grouped[stat?.endpoint].errorCount++;
      }
      grouped[stat?.endpoint].totalResponseTime += stat?.response_time || 0;
    });

    return Object.keys(grouped)?.map(endpoint => ({
      endpoint,
      ...grouped?.[endpoint],
      averageResponseTime: (grouped?.[endpoint]?.totalResponseTime / grouped?.[endpoint]?.count)?.toFixed(2),
      successRate: ((grouped?.[endpoint]?.successCount / grouped?.[endpoint]?.count) * 100)?.toFixed(2)
    }));
  }
};
function lotteryAPIService(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: lotteryAPIService is not implemented yet.', args);
  return null;
}

export { lotteryAPIService };