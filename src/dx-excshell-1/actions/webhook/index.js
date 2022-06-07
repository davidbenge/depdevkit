/**
 * This will take in a JSON payload and store it to the file store
 */

const { Core } = require('@adobe/aio-sdk')
const stateLib = require('@adobe/aio-lib-state')
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils')
const moment = require('moment')
const unirest = require('unirest');
let LEARNER_ID = "learnerX"

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
    logger.info('Calling the webhookin action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams = []
    const requiredHeaders = []
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    //normalize the body
    //logger.debug(`params.__ow_body is ${typeof params.__ow_body}`)
    //logger.debug(`params.__ow_body value = ${params.__ow_body}`)

    if(typeof params.__ow_body == "string"){
      //logger.debug(`params.__ow_body is STRING and we are going to decode it`)
      if((!params.__ow_body.endsWith("}")) || (!params.__ow_body.endsWith("]"))){
        //logger.debug(`params.__ow_body DECODING`)
        let bodyBuffer = Buffer.from(params.__ow_body, 'base64')
        params.__ow_body = bodyBuffer.toString('utf8')
        //logger.debug(`params.__ow_body is now ${params.__ow_body}`)
      }
    }
    
    /****
     * get the paths and use the first one as our key
     */
    if(params.__ow_path && params.__ow_path.length) {
      let parts = params.__ow_path.split('/')
      if(parts.length === 2) {
        LEARNER_ID = decodeURIComponent(parts[1])
      }else{
        const errorMessage = "learner url param (webhook/{learnerX}) is not defined in the request"
        return errorResponse(400, errorMessage, logger)
      }
    }else{
      const errorMessage = "learner url param (webhook/{learnerX}) is not defined in the request"
      return errorResponse(400, errorMessage, logger)
    }

    //store the request payload in the state
    //const state = await stateLib.init()

    //get current learner if they exist 
    //logger.debug(`Learner id is ${LEARNER_ID}`)
    //const res = await state.get(LEARNER_ID) // res = { value, expiration }
    //let learnerValue = res ? res.value : new Array()

    let payloadBody = JSON.parse(params.__ow_body)
    //logger.debug(`payloadBody checking size`)
    const payloadBodySize = Buffer.byteLength(JSON.stringify(payloadBody), 'utf8')

    /*
    let storageContainer = {
      'call-time': moment().unix(),
      'call-size': payloadBodySize,
      'payload': payloadBody
    }
    learnerValue.push(storageContainer)

    await state.put(LEARNER_ID, learnerValue)
    */
   
    //Init the Socket 
    logger.info(`Sending to socket ${params.SOCKET_CLUSTER_ID} ${params.SOCKET_API_KEY} ${LEARNER_ID}`)
    const PieSocket = require("piesocket-nodejs");
    var piesocket = new PieSocket({
      clusterId: params.SOCKET_CLUSTER_ID,
      apiKey: params.SOCKET_API_KEY,
      secret: params.SOCKET_API_SECRET
    });
    
    piesocket.publish(LEARNER_ID, JSON.parse(params.__ow_body));
    logger.info(`Done sending to socket`);

    /*
    const payload = {
      "key": params.SOCKET_API_KEY,
      "secret": params.SOCKET_API_SECRET,
      "channelId": LEARNER_ID,
      "message": params.__ow_body
    }

    var req = unirest('POST', `https://${params.SOCKET_CLUSTER_ID}.piesocket.com/api/publish`)
    .headers({
        'Content-Type': 'application/json'
    })
    .send(JSON.stringify(payload))
    .end(function(res) {
        if (res.error) throw new Error(res.error);
        console.log(res.raw_body);
    });
    */

    const response = {
      statusCode: 200,
      body: {
        'message': `Successfully handled webhook for ${LEARNER_ID}`,
        'payload-size-bytes': payloadBodySize
      }
    }

    // log the response status code
    //logger.info(`${response.statusCode}: successful request`)
    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main
