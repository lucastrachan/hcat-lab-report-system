const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  },
  cognito: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
    userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  },
  app: {
    reportBaseUrl: import.meta.env.VITE_REPORT_BASE_URL || window.location.origin,
  },
};

export default config;
