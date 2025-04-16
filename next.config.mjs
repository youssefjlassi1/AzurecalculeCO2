export default {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/login',
          permanent: true, // Set to true for a 308 permanent redirect
        },
      ];
    },
  };