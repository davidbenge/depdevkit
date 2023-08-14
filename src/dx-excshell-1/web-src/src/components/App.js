/* 
* <license header>
*/

import React, { useEffect, useState } from 'react'
import { Provider, defaultTheme, Grid, View, Heading, Flex, ActionButton, Item, Text, Image, useListData } from '@adobe/react-spectrum'
import {ListView} from '@react-spectrum/list'
import ErrorBoundary from 'react-error-boundary'
import LearnerSelect from './LearnerSelect'
const imageSrc = new URL('../../images/Powered_By_App_Builder_Badge2.png',import.meta.url)

const largeWebhookSample = {
  "id": 1666979207,
  "call-time": 1666979207,
  "call-body-size": 660,
  "body": {
    "event_id": "9d12cd44-0d86-45ca-8b7e-1c11694a234d",
    "event": {
      "body": {
        "jobId": "ddfaae0c-04be-455b-beeb-63783a72081b",
        "outputs": [
          {
            "status": "succeeded",
            "_links": {
              "renditions": [
                {
                  "href": "https://firefly.azureedge.net/40434af8ab5775fd5e79f42c261cdff9/3964773a-ed63-4802-8fe4-4227a7f1bbc5%2Fout_1028_a.jpeg?sv=2019-02-02&se=2022-10-28T19%3A42%3A45Z&si=0ce1dba4-dd5b-4cd9-ad97-24c7276f1b61&sr=b&sp=rw&sig=KKFu4dgxtHBh543fgVrk7cl4o2MWSXtuGp9K6hVneUw%3D",
                  "storage": "external",
                  "type": "image/jpeg"
                }
              ]
            }
          }
        ],
        "_links": {
          "self": {
            "href": "https://image.adobe.io/pie/psdService/status/ddfaae0c-04be-455b-beeb-63783a72081b"
          }
        }
      }
    },
    "recipient_client_id": "59a84be148fb4867bf5781a5887b8d85"
  },
  "headers": {
    "accept-encoding": "deflate, compress, identity",
    "connection": "close",
    "content-type": "application/json",
    "host": "controller",
    "user-agent": "Amazon CloudFront",
    "x-adobe-delivery-id": "7d222af4-6fe1-4ad2-a9c4-8ccf9dc4f18c",
    "x-adobe-digital-signature-1": "faYOd+A5OIEi5nY7UbCulPb2yoR1A2psLAz6NOANGCVU+46ZLCQmugGusoICWJXmBrJ/BDLUzqmakKUWXAx2Dx/CWBtwFjHngdTdEYl5tcCjZFW3mtnmJgyZD9h1IHsN2RpK8kAj60dH7su+U3dSyppXOHJyaVihzTgQidD23mDh0y91lq3/Ss9Jsh8iAUj8EH4skW7O8IJwRHsf5RiTV4qit4h5BPNqCShwi5Q9xVnc+QzA8TO2Rr9nDfNp5ogzB0NV5Jt4SKEqIAjUVPO9fykx8W5Il4CslSHxIHVCWNTtsl9N0HqAOVmq0blTjBwXNr2+gkLbMJ0BCsWWAADcBg==",
    "x-adobe-digital-signature-2": "HAKe5LiXSv5UnhvqBTxx7jl1LxiGQwuaUYDx0nAeXMIfxQWBX8infLCBfYtbgs+2enWBqxZQJWAitbkZFXFpHfUgdOMfqa66mL0tkJrOcu8pI4MYl18XfqlRtpekZHeUBQzzyHJ+hsphJj9CZaV04x2fsVYDg5H136DqciHf5TBta46cPRR7s6J1sSPU8ndKwazLwsKOVZvXth7HwKfgFDBl2zK+aHif5dpc6EHEsOO7/m7/ymEeXQBitL/DTzFd13Ys2H/sk3zFT6CpO2G1dBczmk5hf6iHnL7Yot59Yf1kcazNbMAhMLQ15998wiHTxXg7RSOHx5CHhC49DGsreg==",
    "x-adobe-event-code": "photoshop-job-status",
    "x-adobe-event-id": "9d12cd44-0d86-45ca-8b7e-1c11694a234d",
    "x-adobe-provider": "di_event_code_33C1401053CF76370A490D4C@AdobeOrg",
    "x-adobe-public-key1-path": "/prod/keys/pub-key-rgmKxuQMYS.pem",
    "x-adobe-public-key2-path": "/prod/keys/pub-key-YOtvh3bRKC.pem",
    "x-request-id": "UmF76RcxgWWYABKByt8mtgXFX4QImJWa"
  },
  "query-params": {}
} 

function App (props) {
  //const [learnerId, setLearnerId] = useState()
  //const [loglist,setLoglist] = useState([])
  //const [selectedWebhookCall, setSelectedWebhookCall] = useState(null)
  const [displayedWebhookCall, setDisplayedWebhookCall] = useState()
  const [connectionButtonText, setConnectionButtonText] = useState("")
  //const [socketConnectionStatus, setSocketConnectionStatus] = useState(false)
  let learnerId = undefined
  let socketConnectionStatus = false
  let selectedWebhookCall = null
  const apiKey = `${process.env.SOCKET_API_KEY}`
  const webSocketApiClusterId = `${process.env.SOCKET_CLUSTER_ID}`
  let piesocket = undefined
  const cluster = "demo"
  console.log('runtime object:', props.runtime)
  console.log('ims object:', props.ims)
  console.log('excShell', props.excShell)

  let webhookCallsList = useListData({
    initialItems: [],
    getKey: item => item["call-time"]
  });

  const handleHookCallSelectionChange = (keys) => {
    console.log('handleHookCallSelectionChange', keys['currentKey'])
    selectedWebhookCall = keys['currentKey']
    setDisplayedWebhookCall(webhookCallsList.getItem(selectedWebhookCall))
    console.log('selectedWebhookCall', selectedWebhookCall)
    console.log('displayedWebhookCall', displayedWebhookCall)
  }

  //get json value for dot notation path
  const getDescendantProp = (obj, path) => (
    path.split('.').reduce((acc, part) => acc && acc[part], obj)
  );

  // use exc runtime event handlers
  // respond to configuration change events (e.g. user switches org)
  props.runtime.on('configuration', ({ imsOrg, imsToken, locale }) => {
    console.log('configuration change', { imsOrg, imsToken, locale })
  })
  // respond to history change events
  props.runtime.on('history', ({ type, path }) => {
    console.log('history change', { type, path })
  })

  const clearWebhookCallList = () =>{
    for(item in webhookCallsList.items){
      console.log('clearWebhookCallList item',webhookCallsList.items[item])
      webhookCallsList.remove(webhookCallsList.items[item].id)
    }
    setDisplayedWebhookCall("")
  }

  const clearButtonOnPress = (e) => {
    clearWebhookCallList()
  }

  const handleLearnerInputChange = (plearnerId) => {
    console.log(`in handleLearnerInputChange with socketConnectionStatus = ${socketConnectionStatus}`)
          
    //Toggle the connection
    if(socketConnectionStatus) {
      console.log(`setting socketConnectionStatus to false`)
      //setSocketConnectionStatus(false)
      socketConnectionStatus = false
      setConnectionButtonText("connect")
    }else{
      console.log(`setting socketConnectionStatus to true`)
      //setSocketConnectionStatus(true)
      socketConnectionStatus = true
      setConnectionButtonText("disconnect")
    }

    console.log(`in handleLearnerInputChange post toggle with socketConnectionStatus = ${socketConnectionStatus}`)

    if(typeof plearnerId !== 'undefined' && socketConnectionStatus) {
      console.log(`in payload list setting learner id ${plearnerId}`);
      //learnerId = plearnerId;
      //setLearnerId(plearnerId);
      this.learnerId = plearnerId;
      piesocket = new WebSocket(`wss://${cluster}.piesocket.com/v3/${plearnerId}?api_key=${apiKey}&notify_self`);
      
      piesocket.onmessage = function(message) {
        if(!socketConnectionStatus){
          console.log(`in onmessage and closing with socketConnectionStatus = ${socketConnectionStatus}`);
          try {
            piesocket.close(1000, "Work complete")
          } catch (error) {}
        }
        const data = JSON.parse(message.data);
        data['call-time'] = (data['call-time']*1000);
        webhookCallsList.append(data.event);
        console.log(`Socket incoming message: ${message.data}`);
      }

      piesocket.onclose = function(event) {
        console.log(`closing socket: ${event}`)
      }

      piesocket.onopen = () => {
        console.log(`connected to websocket wss://${webSocketApiClusterId}.piesocket.com/v3/${plearnerId}?api_key=${apiKey}&notify_self`);
      }
    }else{
      try{
        console.log(`in main else and closing with socketConnectionStatus = ${socketConnectionStatus}`);
        webhookCallsList.remove()
        selectedWebhookCall = null
        selectedWebhookCall = null
        piesocket.close(1000, "Work complete")
      }catch(e){}
      console.error(`in handleLearnerInputChange and learner object is undefined`);
    }
  }

  return (
    <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
      <Provider theme={defaultTheme} colorScheme={`light`} >
      <Grid
        areas={[
          'header header',
          'sidebar content'
        ]}
        columns={['1fr', '3fr']}
        rows={['size-1600', 'auto']}
        gap="size-100"
        height="100vh">
        <View gridArea="header" backgroundColor="static-white">
          <Flex direction="column" justifyContent="center" alignItems="center">
            <Heading level={1}>Development Webhook</Heading>
          </Flex>
          <Flex direction="column">
            <Flex direction="row">
                <View marginStart="size-500" >
                  <LearnerSelect onSelectChange={handleLearnerInputChange} connectionStatusText={connectionButtonText} {...props}></LearnerSelect>
                </View>
                <View flex>
                  <Flex direction="column" flex alignItems="end">
                    <View alignItems="end" marginEnd="size-500">
                      <a href="https://developer.adobe.com/app-builder" target="_blank">
                      <Image src={imageSrc} alt="Built with Adobe App Builder" alignSelf="end"/>
                    </a>
                    </View>
                  </Flex>
                </View>
            </Flex>
          </Flex>
        </View>
        <View gridArea="sidebar" marginStart="size-500" backgroundColor="static-white" marginBottom="size-100" minWidth="size-1000">
          <Grid
          areas={[
            'headerBarLeft headerBarRight',
            'resultList resultList'
          ]}
          columns={['1fr', '1fr']}
          rows={['size-500','size-250', 'auto']}
          height="100%"
          gap="size-0">
            <View gridArea="headerBarLeft" padding="size-75">
              <Flex direction="column" justifyContent="center" alignItems="start">
                <Heading level={3} margin="0">All Requests</Heading>
              </Flex>
            </View>
            <View gridArea="headerBarRight" padding="size-50">
              <Flex direction="column" justifyContent="center" alignItems="end">
                <ActionButton width="size-1000" onPress={clearButtonOnPress}>Clear</ActionButton>
              </Flex>
            </View>
            <View gridArea="resultList" height="100vh" minWidth="size-500">
              <Flex direction="column">
                <ListView
                  selectionMode="single"
                  selectionStyle="highlight"
                  aria-label="Websocket post events"
                  height="100vh"
                  items={webhookCallsList.items}
                  //onAction={handleHookCallSelectionChange}
                  onSelectionChange={handleHookCallSelectionChange}
                >
                {(item) => (
                  <Item key={item.key} textValue={item.key}>
                    {new Date((item['call-time']*1000)).toLocaleString("en-US")} {item['query-params'].guid ? `- ${item['query-params'].guid}` : ''} {item['query-params'].GUID ? `- ${item['query-params'].GUID}` : ''} {item['query-params'].namespace ? `- ${item['query-params'].namespace}` : ''} {item['query-params']['custom_path'] ? `- ${getDescendantProp(item,item['query-params']['custom_path'])}` : ''}
                  </Item>
                )}
                </ListView>               
              </Flex>
            </View>
          </Grid>
        </View>
        <View gridArea="content" marginEnd="size-500" backgroundColor="static-white" marginBottom="size-100" overflow="auto">
          {displayedWebhookCall ? (
            <Flex direction="column" marginStart="size-500" marginEnd="size-500" >
              <View backgroundColor="gray-50" >
                <pre>
                  <Text>{displayedWebhookCall ? (JSON.stringify(displayedWebhookCall, null, 2)) : ''}</Text>
                </pre>
              </View>
            </Flex>
          ) : ''}
        </View> 
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
