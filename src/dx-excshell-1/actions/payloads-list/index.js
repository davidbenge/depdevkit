/**
 * This will list all the payloads in the file store
 */

 const { Core } = require('@adobe/aio-sdk')
 const stateLib = require('@adobe/aio-lib-state')
 const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils')
 let LEARNER_ID = "learnerX"

 // main function that will be executed by Adobe I/O Runtime
 async function main (params) {
   // create a Logger
   const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
 
   try {
     // 'info' is the default level if not set
     logger.info('Calling the  action payloads-list')
 
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
    const state = await stateLib.init()

    //get current learner if they exist 
    //logger.debug(`Learner id is ${LEARNER_ID}`)
    const res = await state.get(LEARNER_ID) // res = { value, expiration }
    let learnerValue = res ? res.value : new Array()
    
    return{
      statusCode:200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: learnerValue
    }
   } catch (error) {
     // log any server errors
     logger.error(error)
     // return with 500
     return errorResponse(500, 'server error', logger)
   }
 }
 
 exports.main = main
 