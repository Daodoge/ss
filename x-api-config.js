// backend/x-api-config.js
class XApiConfig {
  constructor() {
    this.bearerToken = process.env.X_BEARER_TOKEN;
    this.baseUrl = 'https://api.x.com/2';
  }

  async makeRequest(endpoint, params = {}) {
    if (!this.bearerToken) {
      throw new Error('X API Bearer Token 未配置');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const queryParams = new URLSearchParams(params).toString();
    const fullUrl = queryParams ? `${url}?${queryParams}` : url;

    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API请求错误:', error);
      throw error;
    }
  }
}

export default XApiConfig;