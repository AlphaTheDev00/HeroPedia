// Minimal Netlify function without any external dependencies
export function handler(event, context) {
  console.log('Function triggered');
  console.log('Event path:', event.path);
  
  // Return a simple success response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'HeroPedia diagnostic function is working',
      timestamp: new Date().toISOString(),
      path: event.path,
      httpMethod: event.httpMethod,
      // Include some environment info (non-sensitive)
      environment: {
        nodeEnv: process.env.NODE_ENV || 'not set',
        appUrl: process.env.APP_URL || 'not set',
      }
    }),
  };
}
