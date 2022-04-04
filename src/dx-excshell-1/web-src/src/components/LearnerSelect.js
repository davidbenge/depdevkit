/* 
* <license header>
*/
import React, { useState, useEffect } from 'react';
import '@spectrum-css/typography';
import '@spectrum-css/table';
import {
  ComboBox, 
  Item, 
  Section,
  Flex
} from '@adobe/react-spectrum';
import Cookies from 'js-cookie';
import actions from '../config';

function LearnerSelect ({onSelectChange,...props}) {
  const learners = [
    {
      "id": 1,
      "name": "Learner 1",
      "webhookId": "webhook1",
      "key": "learner1"
    },
    {
      "id": 2,
      "name": "Learner 2",
      "webhookId": "webhook2",
      "key": "learner2"
    }
  ];
  const [selectedLearnerId, setLearnerId] = useState(1);
  const [selectedLearnerObject, setLearnerObject] = useState(learners[0]);
  const defaultLeanerKey = "learner1";

  const setSelectedLearnerCookie = (value) => {
    Cookies.set('selectedLearner', value);
  }

  const getSelectedLearnerCookie = (value) => {
    return Cookies.get('selectedLearner');
  }

  const getLearnerObjectByKey = (key) => {
    let learner = learners.find(l => l.key === key);
    return learner;
  }

  const handleInputChange = (sle) => {
    console.log(sle);
    let selectedLearnerObject = getLearnerObjectByKey(sle);

    console.log(selectedLearnerObject);
    setLearnerId(selectedLearnerObject.id);
    setSelectedLearnerCookie(sle);
    setLearnerObject(selectedLearnerObject);
    onSelectChange(selectedLearnerObject);
    console.log(`LS selected learner: ${sle}`);
  };

  useEffect(() => {
    let cookieSelectLearner = getSelectedLearnerCookie();
    let startUpLearnerKey = defaultLeanerKey;

    console.log(`cookieSelectLearner: ${cookieSelectLearner}`);
    if(typeof cookieSelectLearner !== 'undefined') {
      startUpLearnerKey = cookieSelectLearner;
    }
    console.log(`startUpLearner: ${startUpLearnerKey}`);
    let selectedLearnerObject = getLearnerObjectByKey(startUpLearnerKey);

    setSelectedLearnerCookie(selectedLearnerObject.key);
    setLearnerId(selectedLearnerObject.id);
    setLearnerObject(selectedLearnerObject);
    onSelectChange(selectedLearnerObject);
  }, []);

  return (
    <Flex direction="column">
      <ComboBox label="Target Learner Environment" isRequired onSelectionChange={handleInputChange} defaultItems={learners} defaultSelectedKey={1} selectedKey={selectedLearnerId} inputValue={selectedLearnerObject.name}>
        {item => <Item>{item.name}</Item>}
      </ComboBox>
        Webhook endpoint:<br/>
        <span>{actions[selectedLearnerObject.webhookId]}</span>
    </Flex>
  )
}

export default LearnerSelect
