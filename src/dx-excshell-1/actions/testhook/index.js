/**
 * This will take in a JSON payload and spam it to a websocket
 */

const { Core, Files } = require('@adobe/aio-sdk')
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  // Handle challenge request
  if (params.challenge) {
    let response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        challenge: params.challenge
      }
    };
    /*
    response.body = new Buffer(JSON.stringify({
          "challenge": params.challenge
    })).toString('base64');
    */

    return response;
  }

  try {
    // 'info' is the default level if not set
    logger.info('Calling the webhookin socket action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(process.env))

    // check for missing request input parameters and headers
    const requiredParams = []
    const requiredHeaders = []
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    //Init the Socket 
    const PieSocket = require("piesocket-nodejs");
    var piesocket = new PieSocket({
      clusterId: params.SOCKET_CLUSTER_ID,
      apiKey: params.SOCKET_API_KEY,
      secret: params.SOCKET_API_SECRET
    });
    
    piesocket.publish("benge", JSON.parse(params.__ow_body));

    const response = {
      statusCode: 200,
      body: {
        'message': 'Successfully forwarded the payload to the socket'
      }
    }

    // log the response status code
    logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main
