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
  View,
  TextField,
  Button,
  Text,
  Heading
} from '@adobe/react-spectrum';
import Cookies from 'js-cookie';
import actions from '../config';

function LearnerSelect ({onSelectChange,...props}) {
  const [selectedLearnerId, setLearnerId] = useState();

  const handleInputChange = (sle) => {
    console.log("handleInputChange");
    console.log(sle);

    Cookies.set('selectedLearner', sle);
    setLearnerId(sle);
  };

  const sendLearnerChange = () => {
    console.log("sendLearnerChange");
    onSelectChange(selectedLearnerId);
  }

  useEffect(() => {
  }, []);

  return (
    <div>
        <div class="basic-url">Webhook URI</div>
        <div class="webhook-url-wrapper">
					<span class="webhook-url">/webhook/</span>
					<TextField UNSAFE_className="webhook-url-channel" onChange={handleInputChange} value={selectedLearnerId} />
					<span class="input-group-btn">
            <Button variant="primary" onPress={sendLearnerChange} >Connect</Button>
					</span>
				</div>
    </div>
  )
}

export default LearnerSelect
