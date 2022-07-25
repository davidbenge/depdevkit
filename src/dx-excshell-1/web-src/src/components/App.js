/* 
* <license header>
*/

import React from 'react'
import { Provider, defaultTheme, Grid, View, Heading, Flex, ActionButton, Item } from '@adobe/react-spectrum'
import {ListView} from '@react-spectrum/list'
import ErrorBoundary from 'react-error-boundary'
import { PayloadList } from './PayloadList'
import Button from '@spectrum-icons/workflow/Button'
import LearnerSelect from './LearnerSelect'

function App (props) {
  console.log('runtime object:', props.runtime)
  console.log('ims object:', props.ims)
  console.log('excShell', props.excShell)

  // use exc runtime event handlers
  // respond to configuration change events (e.g. user switches org)
  props.runtime.on('configuration', ({ imsOrg, imsToken, locale }) => {
    console.log('configuration change', { imsOrg, imsToken, locale })
  })
  // respond to history change events
  props.runtime.on('history', ({ type, path }) => {
    console.log('history change', { type, path })
  })

  return (
    <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
      <Provider theme={defaultTheme} colorScheme={`light`}>
      <Grid
        areas={[
          'header header',
          'sidebar content'
        ]}
        columns={['2fr', '2fr']}
        rows={['size-1000', 'auto']}
        gap="size-100">
        <View gridArea="header">
          <Flex direction="column" justifyContent="center" alignItems="center">
            <Heading level={1}>Webhook Test Viewer</Heading>
          </Flex>
        </View>
        <View gridArea="sidebar">
          <Grid
          areas={[
            'connectBar connectBar',
            'headerBarLeft headerBarRight',
            'resultList resultList'
          ]}
          columns={['2fr', '2fr']}
          rows={['size1000','size-500', 'auto']}
          height="size-6000"
          gap="size-0">
            <View gridArea="connectBar" padding="size-50">
              <LearnerSelect></LearnerSelect>
            </View>
            <View gridArea="headerBarLeft" padding="size-150">
              <Flex direction="column" height="100%" justifyContent="center" alignItems="start">
                <Heading level={3} margin="0">All Requests</Heading>
              </Flex>
            </View>
            <View gridArea="headerBarRight" padding="size-20">
              <Flex direction="column" height="100%" justifyContent="center" alignItems="end">
                <ActionButton width="size-1000">Clear</ActionButton>
              </Flex>
            </View>
            <ListView gridArea="resultList"
              selectionMode="single"
              selectionStyle="highlight"
              aria-label="Websocket post events"
            >
              <Item>POST /webhook/dave1 200 OK 3.26ms</Item>
              <Item>POST /webhook/dave1 200 OK 3.26ms</Item>
              <Item>POST /webhook/dave1 200 OK 3.2ms</Item>
              <Item>POST /webhook/dave1 200 OK 3.26ms</Item>
              <Item>POST /webhook/dave1 200 OK 3.5ms</Item>
              <Item>POST /webhook/dave1 200 OK 3.3ms</Item>
              <Item>POST /webhook/dave1 200 OK 3.7ms</Item>
              <Item>POST /webhook/dave1 200 OK 3.9ms</Item>
              <Item>POST /webhook/dave1 200 OK 3.2ms</Item>
            </ListView>
          </Grid>
        </View>
        <View backgroundColor="purple-600" gridArea="content" />
        <View backgroundColor="magenta-600" gridArea="footer" />
      </Grid>
      </Provider>
    </ErrorBoundary>
  )

  // Methods
  /*
  <PayloadList runtime={props.runtime} ims={props.ims} actionCallHeaders={props.actionCallHeaders}/>
  */

  // error handler on UI rendering failure
  function onError (e, componentStack) { }

  // component to show if UI fails rendering
  function fallbackComponent ({ componentStack, error }) {
    return (
      <React.Fragment>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
          Something went wrong :(
        </h1>
        <pre>{componentStack + '\n' + error.message}</pre>
      </React.Fragment>
    )
  }
}

export default App
