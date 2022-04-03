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

function LearnerSelect ({onSelectChange,...props}) {
  const learners = {
    "learner1": {
      "name": "Learner 1",
      "webhookUrl": "/api/v1/web/dx-excshell-1/webhook1"
    },
    "learner2": {
      "name": "Learner 2",
      "webhookUrl": "/api/v1/web/dx-excshell-1/webhook2"
    }
  }
  const [selectedLearner, setLearner] = useState('learner1');
  const [selectedLearnerObject, setLearnerObject] = useState(learners[selectedLearner]);

  const handleInputChange = (sle) => {
    setLearner(sle);
    setLearnerObject(learners[sle]);
    onSelectChange(learners[sle]);
    console.log(`LS selected learner: ${sle}`);
  };

  return (
    <Flex>
      <Flex>
      <ComboBox label="Target Learner Environment" onSelectionChange={handleInputChange}>
        <Item key="learner1" >Learner 1</Item>
        <Item key="learner2">Learner 2</Item>
      </ComboBox>
      </Flex>
      <Flex>
        Webhook endpoint:<br/>
        <span>{selectedLearnerObject.webhookUrl}</span>
      </Flex>
    </Flex>
  )
}

export default LearnerSelect
