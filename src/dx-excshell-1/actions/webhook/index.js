/**
 * This will take in a JSON payload and store it to the file store
 */

const { Core, Files } = require('@adobe/aio-sdk')
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

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

    //store the request payload in the file store
    const fileLib = await Files.init()
    // delete all files including public
    //await fileLib.delete('/')

    // Now we are going to store payload in the file store as a JSON file.  the file name will be the current timestamp and the folder ATM is default 
    const nowKey = new Date().getTime()

    //clean params 
    params['webhook_receive_id'] = nowKey

    // clean up the params to store.  We want to remove all the OpenWhisk related ones
    let cleanParams = Object.assign({},params)
    delete cleanParams['LEARNER_ID']
    delete cleanParams['LOG_LEVEL']
    delete cleanParams.__ow_headers.via
    delete cleanParams.__ow_headers['x-azure-clientip']
    delete cleanParams.__ow_headers['x-azure-fdid']
    delete cleanParams.__ow_headers['x-azure-ref']
    delete cleanParams.__ow_headers['x-azure-requestchain']
    delete cleanParams.__ow_headers['x-azure-socketip']
    delete cleanParams.__ow_headers['x-envoy-external-address']
    delete cleanParams.__ow_headers['x-forwarded-for']
    delete cleanParams.__ow_headers['x-forwarded-host']
    delete cleanParams.__ow_headers['x-forwarded-port']
    delete cleanParams.__ow_headers['x-forwarded-proto']
    delete cleanParams.__ow_headers['x-real-ip']
    delete cleanParams.__ow_headers['x-request-id']
    delete cleanParams.__ow_headers['sec-ch-ua']
    delete cleanParams.__ow_headers['sec-ch-ua-mobile']
    delete cleanParams.__ow_headers['sec-ch-ua-platform']
    delete cleanParams.__ow_headers['sec-fetch-dest']
    delete cleanParams.__ow_headers['sec-fetch-mode']
    delete cleanParams.__ow_headers['sec-fetch-site']
    delete cleanParams.__ow_headers['referer']
    delete cleanParams.__ow_headers['perf-br-req-in']
    delete cleanParams.__ow_headers['host']
    delete cleanParams.__ow_method
    delete cleanParams.__ow_path

    logger.debug("FILE CONTENT")
    logger.debug(stringParameters(cleanParams))
    
    await fileLib.write(`${params.LEARNER_ID}/${nowKey}.json`,JSON.stringify(cleanParams))

    const response = {
      statusCode: 200,
      body: {
        message: 'Successfully stored the payload in the file store',
        payloadKey: nowKey
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
