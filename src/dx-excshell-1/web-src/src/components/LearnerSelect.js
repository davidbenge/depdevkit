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
  Flex,
  TextField
} from '@adobe/react-spectrum';
import Cookies from 'js-cookie';
import actions from '../config';

function LearnerSelect ({onSelectChange,...props}) {
  const [selectedLearnerId, setLearnerId] = useState('learner1');

  const getSelectedLearnerCookie = (value) => {
    return Cookies.get('selectedLearner');
  }

  const handleInputChange = (sle) => {
    console.log("handleInputChange");
    console.log(sle);

    Cookies.set('selectedLearner', sle);
    onSelectChange(sle);
    setLearnerId(sle);
  };

  useEffect(() => {
    let cookieSelectLearner = getSelectedLearnerCookie();

    console.log(`cookieSelectLearner: ${cookieSelectLearner}`);
    if(typeof cookieSelectLearner !== 'undefined') {
      onSelectChange(cookieSelectLearner);
      setLearnerId(cookieSelectLearner);
    }
    console.log(`startUpLearner: ${cookieSelectLearner}`);
  }, []);

  return (
    <Flex direction="column">
      <TextField label="Target Learner ID" onChange={handleInputChange} value={selectedLearnerId} />
        Webhook endpoint:<br/>
        <span>{actions['webhook']}/{selectedLearnerId}</span>
    </Flex>
  )
}

export default LearnerSelect
