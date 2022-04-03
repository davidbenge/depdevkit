/**
 * This will list all the payloads in the file store
 */

 const { Core, Files } = require('@adobe/aio-sdk')
 const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils')
 
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
     const requiredParams = ['leaner_id']
     const requiredHeaders = ['Authorization']
     const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
     if (errorMessage) {
       // return and log client errors
       return errorResponse(400, errorMessage, logger)
     }
 
     //store the request payload in the file store
     const fileLib = await Files.init()
 
     const existingFiles = await fileLib.list(`/${params.leaner_id}/`)
    
    if(!existingFiles.length){
      return errorResponse(404,'No payloads found',logger)
    }else{
      const body = []

      for(let {name} of existingFiles){
        let buffer = await fileLib.read(`${name}`)
        body.push(JSON.parse(buffer.toString()))
      }

      return{
        statusCode:200,
        body
      }
    }
   } catch (error) {
     // log any server errors
     logger.error(error)
     // return with 500
     return errorResponse(500, 'server error', logger)
   }
 }
 
 exports.main = main
 