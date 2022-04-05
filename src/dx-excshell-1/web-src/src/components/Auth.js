/*
* <license header>
*/

import React from 'react'
import { Flex, Heading, View, Well, Divider } from '@adobe/react-spectrum'
import actions from '../config';

export const Auth = () => {
  const resultSample = {
    "access_token": "eyJhbGciOiJSUzI....",
    "expires_in": 86399992,
    "psql": "psql 'sslmode=require host=tenant__test_name.platform-query.adobe.io port=80 dbname=my__fake_sandbox_name:all user=3C9419175E9D393C0A495E39@AdobeOrg password=eyJhbGciOiJSUzI....'",
    "token_type": "bearer"
  };

  return(
  <View width='size-6000'>
    <Heading level={1}>Authentication Help</Heading>

    <Flex width='100%' direction="column">
      <p>The authentication helper serivce can be found at <pre>{actions['get-auth']}</pre></p>
      <Well width='100%'>
        To use the service you must post the following parameters to the service:
        <ul>
          <li>client_id=XXXXX</li>
          <li>technical_account_id=XXXXX@techacct.adobe.com</li>
          <li>org_id=XXXXX@AdobeOrg</li>
          <li>client_secret=XXXXX</li>
          <li>private_key=XXXXX</li>
          <li>meta_scopes=ent_dataservices_sdk</li>
        </ul>
        Optionaly you can add the following parameters to the service to have it bring back psql:
        <ul>
          <li>tenant_name=XXXXX</li>
          <li>sandbox_name=XXXXX</li>
        </ul>
        <br></br>
        <br></br>
        The service will return a json object with the following keys:
        <pre>{JSON.stringify(resultSample, null, 3)}</pre>
      </Well>
      <Divider />
      <Well width='100%'>
      <p>To use the auth service with postman you can include a Pre-request Script that will set enviroment variables.</p>
      <p>This is an example of a POSTMAN Pre-request Script to set the ACCESS_TOKEN based on the training auth micro service call</p>
      </Well>
      
      <Well>
      <pre><code> 
      {`const ERROR_MESSAGE = " not found in active environment. Please ensure the correct environment is selected and populated.";

function getAccessToken() {
    if (!pm.environment.get("IMS_ORG")) {
        throw new Error("IMS_ORG" + ERROR_MESSAGE);
    } else if (!pm.environment.get("TECHNICAL_ACCOUNT_ID")) {
        throw new Error("TECHNICAL_ACCOUNT_ID" + ERROR_MESSAGE);
    } else if (!pm.environment.get("IMS")) {
        throw new Error("IMS" + ERROR_MESSAGE);
    } else if (!pm.environment.get("API_KEY")) {
        throw new Error("API_KEY" + ERROR_MESSAGE);
    } else if (!pm.environment.get("META_SCOPE")) {
        throw new Error("META_SCOPE" + ERROR_MESSAGE);
    } else if (!pm.environment.get("PRIVATE_KEY")) {
        throw new Error("Ensure the Private Key is added to both INITIAL and CURRENT VALUES in the active Postman environment's PRIVATE_KEY variable");
    }

    const loginRequest = {
        url: '` + actions['get-auth'] + `',
        method: 'POST',
        header: 'Content-Type: application/json',
        body: {
             mode: 'urlencoded',
            urlencoded: [
                {key: "client_id", value: pm.environment.get("API_KEY")},
                {key: "technical_account_id", value: pm.environment.get("TECHNICAL_ACCOUNT_ID")},
                {key: "org_id", value: pm.environment.get("IMS_ORG")},
                {key: "client_secret", value: pm.environment.get("CLIENT_SECRET")},
                {key: "private_key", value: pm.environment.get("PRIVATE_KEY")},
                {key: "meta_scopes", value: pm.environment.get("META_SCOPE")},
                {key: "tenant_name", value: pm.environment.get("TENANT_ID")},
                {key: "sandbox_name", value: pm.environment.get("SANDBOX_NAME")}
            ]
        }
    };

    console.log("getting login based on data", loginRequest);

    pm.sendRequest(loginRequest, function (err, response) {
        console.log("call response", response);
        let token = response.json().access_token;
        pm.environment.set("ACCESS_TOKEN", token);
    });
}

getAccessToken();`}    
      </code></pre>

      </Well>
    </Flex>
  </View>
  )
}
