/* 
* <license header>
*/

import React from 'react'
import { Provider, defaultTheme, Grid, View } from '@adobe/react-spectrum'
import ErrorBoundary from 'react-error-boundary'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import SideBar from './SideBar'
import ActionsForm from './ActionsForm'
import { Home } from './Home'
import { Auth } from './Auth'
import { About } from './About'
import PayloadTestForm from './PayloadTestForm'
import { PayloadList } from './PayloadList'

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
      <Router>
        <Provider theme={defaultTheme} colorScheme={`light`}>
          {props.excShell? (
            <Grid
            areas={['sidebar content']}
            columns={['256px', '3fr']}
            rows={['auto']}
            height='100vh'
            gap='size-100'
          >
            <View
              gridArea='sidebar'
              backgroundColor='gray-200'
              padding='size-200'
            >
              <SideBar></SideBar>
            </View>
            <View gridArea='content' padding='size-200'>
              <Switch>
                <Route exact path='/'>
                  <Home></Home>
                </Route>
                <Route path='/auth'>
                  <Auth runtime={props.runtime} ims={props.ims} actionCallHeaders={props.actionCallHeaders}/>
                </Route>
                <Route path='/payload-test'>
                  <PayloadTestForm runtime={props.runtime} ims={props.ims} actionCallHeaders={props.actionCallHeaders}/>
                </Route>
                <Route path='/payload-list'>
                  <PayloadList runtime={props.runtime} ims={props.ims} actionCallHeaders={props.actionCallHeaders}/>
                </Route>
              </Switch>
            </View>
          </Grid>
          ) : (
            <View padding='size-200'>
              <Switch>
                <Route exact path='/'>
                  <Home></Home>
                </Route>
                <Route path='/auth'>
                  <Auth runtime={props.runtime} ims={props.ims} actionCallHeaders={props.actionCallHeaders}/>
                </Route>
                <Route path='/payload-test'>
                  <PayloadTestForm runtime={props.runtime} ims={props.ims} actionCallHeaders={props.actionCallHeaders}/>
                </Route>
                <Route path='/payload-list'>
                  <PayloadList runtime={props.runtime} ims={props.ims} actionCallHeaders={props.actionCallHeaders}/>
                </Route>
              </Switch>
            </View>
          )}
        </Provider>
      </Router>
    </ErrorBoundary>
  )

  // Methods

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
