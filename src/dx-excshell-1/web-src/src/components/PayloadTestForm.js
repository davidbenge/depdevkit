/* 
* <license header>
*/

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ErrorBoundary from 'react-error-boundary'
import {
  Flex,
  Heading,
  Form,
  Picker,
  TextArea,
  Button,
  ActionButton,
  StatusLight,
  ProgressCircle,
  Item,
  Text,
  View
} from '@adobe/react-spectrum'
import Function from '@spectrum-icons/workflow/Function'

import actions from '../config.json'
import actionWebInvoke from '../utils'

const PayloadTestForm = (props) => {
  const [state, setState] = useState({
    actionResponse: null,
    actionResponseError: null,
    actionPayload: null,
    actionPayloadValid: null,
    actionInvokeInProgress: false,
    actionResult: ''
  })

  console.log('actions', actions)

  return (
    <View width="size-6000">
      <Heading level={1}>Post data into webhook</Heading>
      <Form necessityIndicator="label">

        <TextArea
          label="json payload"
          placeholder='{ "mykey": "my super cool value", "anotherKey":"another super critical value" }'
          validationState={state.payloadValid}
          onChange={(input) =>
            setJSONInput(input, 'actionPayload', 'actionPayloadValid')
          }
        />
        <Flex>
          <ActionButton
            variant="primary"
            type="button"
            onPress={invokeAction.bind(this)}
            isDisabled={!state.actionPayloadValid}
          ><Function aria-label="Invoke" /><Text>Invoke</Text></ActionButton>

          <ProgressCircle
            aria-label="loading"
            isIndeterminate
            isHidden={!state.actionInvokeInProgress}
            marginStart="size-100"
          />
        </Flex>
      </Form>

      {state.actionResponseError && (
        <View padding={`size-100`} marginTop={`size-100`} marginBottom={`size-100`} borderRadius={`small `}>
          <StatusLight variant="negative">Failure! See the complete error in your browser console.</StatusLight>
        </View>
      )}
      {!state.actionResponseError && state.actionResponse && (
        <View padding={`size-100`} marginTop={`size-100`} marginBottom={`size-100`} borderRadius={`small `}>
          <StatusLight variant="positive">Success! See the complete response in your browser console.</StatusLight>
        </View>
      )}

        <TextArea
            label="results"
            isReadOnly={true}
            width="size-6000"
            height="size-6000"
            maxWidth="100%"
            value={state.actionResult}
            validationState={( !state.actionResponseError ) ? 'valid' : 'invalid'}
          />
        
        <p>You can post to this webhook using this form or using api listed above from a tool like postman or by using code.</p>
    </View>
  )

  // Methods

  // parses a JSON input and adds it to the state
  async function setJSONInput (input, stateJSON, stateValid) {
    let content
    let validStr = null
    if (input) {
      try {
        content = JSON.parse(input)
        validStr = 'valid'
      } catch (e) {
        content = null
        validStr = 'invalid'
      }
    }
    setState({ ...state, [stateJSON]: content, [stateValid]: validStr })
  }

  // invokes a the selected backend actions with input headers and params
  async function invokeAction () {
    setState({ ...state, actionInvokeInProgress: true, payloadResult: 'calling action ... ' })
    const headers = {}
    const params = {}
    console.log("state on submit",state)
    params.payload = state.actionPayload
    const startTime = Date.now()
    let formattedResult = ""
    try {
      // invoke backend action
      const actionResponse = await actionWebInvoke(actions["webhook-in"], headers, params)
      formattedResult = `time: ${Date.now() - startTime} ms\n` + JSON.stringify(actionResponse,0,2)
      // store the response
      setState({
        ...state,
        actionResponse,
        actionResult:formattedResult,
        actionResponseError: null,
        actionInvokeInProgress: false
      })
      console.log(`Response from webhook-in:`, actionResponse)
    } catch (e) {
      // log and store any error message
      formattedResult = `time: ${Date.now() - startTime} ms\n` + e.message
      console.error(e)
      setState({
        ...state,
        actionResponse: null,
        actionResult:formattedResult,
        actionResponseError: e.message,
        actionInvokeInProgress: false
      })
    }
  }
}

PayloadTestForm.propTypes = {
  runtime: PropTypes.any,
  ims: PropTypes.any
}

export default PayloadTestForm
