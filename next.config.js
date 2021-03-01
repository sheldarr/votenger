/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const withOffline = require('next-offline');

module.exports = withOffline({
  future: { webpack5: true },
  redirects: async () => {
    return [
      {
        destination: '/events',
        permanent: false,
        source: '/',
      },
    ];
  },
});
