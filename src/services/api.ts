const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_API_KEY || '';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

class InvestmentApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Portfolio endpoints
  async getPortfolio(code: string) {
    return this.makeRequest(`/core/portfolio/${encodeURIComponent(code)}`);
  }

  async getPortfolios(codes: string[]) {
    return this.makeRequest('/core/portfolio', {
      method: 'POST',
      body: JSON.stringify(codes),
    });
  }

  // Security endpoints
  async getSecurity(code: string) {
    return this.makeRequest(`/core/security/${encodeURIComponent(code)}`);
  }

  async getSecurities(codes: string[]) {
    return this.makeRequest('/core/security', {
      method: 'POST',
      body: JSON.stringify(codes),
    });
  }

  // Analytics endpoints
  async getPrices(params: {
    portfolio_codes?: string[];
    security_codes?: string[];
    local_only?: boolean;
    intraday?: boolean;
    currency?: string;
  }) {
    return this.makeRequest('/analytics/prices', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getReturns(params: {
    portfolio_codes?: string[];
    security_codes?: string[];
    use_ln_ret?: boolean;
    win_size?: number;
    local_only?: boolean;
  }) {
    return this.makeRequest('/analytics/returns', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getRealisedVolatility(params: {
    portfolio_codes?: string[];
    security_codes?: string[];
    rv_model?: string;
    rv_win_size?: number;
    local_only?: boolean;
  }) {
    return this.makeRequest('/analytics/realised-volatility', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getCorrelations(params: {
    portfolio_codes?: string[];
    security_codes?: string[];
    use_returns?: boolean;
    log_returns?: boolean;
    ret_win_size?: number;
    corr_model?: string;
    window?: number;
    lag?: number;
  }) {
    return this.makeRequest('/analytics/correlations', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getMetrics(params: {
    portfolio_codes?: string[];
    security_codes?: string[];
    metric_win_size?: number;
    risk_free_rate?: number;
    periods_per_year?: number;
    local_only?: boolean;
  }) {
    return this.makeRequest('/analytics/metrics', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getVaR(params: {
    portfolio_codes?: string[];
    security_codes?: string[];
    var_win_size?: number;
    confidence_level?: number;
    method?: string;
    local_only?: boolean;
  }) {
    return this.makeRequest('/analytics/var', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}

export const investmentApi = new InvestmentApiService();
export default investmentApi;
