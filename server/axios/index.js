const axios = require('axios');

const logger = require('../logger');

function initializeAxios() {
  axios.interceptors.request.use((config) => {
    logger.info(
      `EXTERNAL REQUEST: ${String(config.method).toUpperCase()} ${
        config.url
      } ${JSON.stringify(config.data || {})} ${JSON.stringify(config.headers)}`,
    );

    return config;
  });
  axios.interceptors.response.use(
    (response) => {
      logger.info(
        `EXTERNAL RESPONSE: ${response.status} ${String(
          response.config.method,
        ).toUpperCase()} ${response.config.url} ${JSON.stringify(
          response.data,
        )} ${JSON.stringify(response.headers)}`,
      );

      return response;
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error) => {
      logger.error(
        `ERROR EXTERNAL RESPONSE: ${error.response.status} ${String(
          error.response.config.method,
        ).toUpperCase()}  ${error.response.config.url} ${
          error.message
        }${JSON.stringify(error.response.data)} ${JSON.stringify(
          error.response.headers,
        )}`,
      );

      return Promise.reject(error);
    },
  );
}

module.exports = initializeAxios;
