/*
 * <license header>
 */

import React, { useState, useEffect } from 'react';
import '@spectrum-css/typography';
import '@spectrum-css/table';
import {
  View,
  Flex,
  Checkbox,
  ProgressCircle,
  Button,
  ButtonGroup,
  DialogContainer,
  AlertDialog,
  ComboBox, 
  Item, 
  Section
} from '@adobe/react-spectrum';
import { useHistory } from 'react-router-dom';
import actionWebInvoke from '../utils';
import actions from '../config';
import LearnerSelect from './LearnerSelect';
import Cookies from 'js-cookie';

const selection = new Set();

export const PayloadList = ({ actionCallHeaders, props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [payloads, setPayloads] = useState([]);
  const [selectedPayloads, setSelectedPayloads] = useState(selection);
  const [isDialogOpen, setDialogIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [learnerId, setLearnerId] = useState();
  const history = useHistory();
  const [hasFocus, setFocus] = useState(true);

  const JsonConfig = {
    type: "front end",
    items: [{ name: 10, url: true }]
  };

  useEffect(() => {
    (async () => {
    })();

    document.addEventListener("visibilitychange", function() {
      //console.log( 'document.hidden', document.hidden );  
      activeViewChanged(document.hidden);
    });
    
    window.addEventListener('focus', function() {
     //console.log("window is active!" );
     activeViewChanged(true);
    });
    
    window.addEventListener('blur', function() {
      //console.warn("window is not active!" );
      activeViewChanged(false);
    });
    
    loadPayloads();

    const interval=setInterval(()=>{
      loadPayloads();
     },30000)
       
     return()=>clearInterval(interval);

  }, []);

  const activeViewChanged = (newValue) => {
    //console.info("setting focus to",newValue);
    setFocus(newValue);
  };

  const loadPayloads = async () => {
    console.log(`in loadPayloads and has focus is ${hasFocus} and learner id is ${learnerId}`);
    if((!hasFocus) || (typeof learnerId === 'undefined')) {
      if(typeof learnerId === 'undefined'){
        //double check for page restarts
        checkForCookieSet();
      }
      return;
    }
    console.log(`in loadPayloads and moving forward`);
    setIsLoading(true);

    let res;
    try{
      res = await actionWebInvoke(`${actions['payloads-list']}/${learnerId}`,actionCallHeaders);
    }catch(e){
      console.error(e);
    } 
    console.log(res);

    if(res.status === 404){
      alert(`No payloads found for this learner ${learnerId}`);
      setPayloads([]);
    }else if(res.error) {
      alert(res.error.message);
      setPayloads([]);
    } else {
      //if the payload has updated set the object
      if(res.length !== payloads.length){
        setPayloads(res.reverse());
        console.log("loadPayloads after change load",payloads);
      }
    }

    setIsLoading(false);
  };

  const checkForCookieSet = () => {
    let cookieSelectLearner = Cookies.get('selectedLearner');
    console.log('cookie check');
    if(typeof cookieSelectLearner !== 'undefined'){
      console.log('cookie check found',cookieSelectLearner);
      learnerId = cookieSelectLearner;
    }
  }

  const handleLearnerInputChange = (plearnerId) => {
    console.log(`in payload list handleLearnerInputChange ${plearnerId}`);
    if(typeof plearnerId !== 'undefined') {
      console.log(`in payload list setting learner id ${plearnerId}`);
      learnerId = plearnerId;
    }else{
      console.error(`in handleLearnerInputChange and learner object is undefined`);
    }
  };

  return (
    <View elementType="main" minHeight="100vh" marginX="size-400" onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}>
      <Flex alignItems="center" justifyContent="center" direction="column" marginY="size-400" gap="size-400">
        <h2 className="spectrum-Heading spectrum-Heading--sizeL spectrum-Heading--serif">Browse all webhook payloads</h2>
        
        <Flex width="100%" alignItems="left">
        <LearnerSelect onSelectChange={handleLearnerInputChange} {...props}></LearnerSelect>
        </Flex>
        <Flex width="100%" alignItems="center">
          <ButtonGroup marginEnd="size-200">
            <Button
              variant="cta"
              onPress={() => {
                history.push('/create');
              }}>
              WHAT TO DO? NEXT ACTION FOR SELECTED. Eric?
            </Button>
            <Button
              variant="primary"
              isDisabled={selection.size === 0}
              onPress={() => {
                setDialogIsOpen(true);
              }}>
              Delete selection (TBD)
            </Button>
          </ButtonGroup>
          {isDeleting && <ProgressCircle size="S" aria-label="Is deleting…" isIndeterminate />}
        </Flex>

        {isLoading ? (
          <ProgressCircle size="L" aria-label="Loading…" isIndeterminate />
        ) : (
          <table className="spectrum-Table" style={{ width: '100%' }}>
            <thead className="spectrum-Table-head">
              <tr>
                <th className="spectrum-Table-headCell">
                  <Checkbox
                    aria-label="Select All"
                    onChange={(checked) => {
                      selection.clear();
                      if (checked) {
                        selection.clear();
                        payloads.forEach((payload) => selection.add(payloads.id));
                      }
                      setSelectedPayloads(new Set(selection));
                    }}
                  />
                </th>
                <th className="spectrum-Table-headCell">
                  Rec Id
                </th>
                <th className="spectrum-Table-headCell">
                  Webhook Payload
                </th>
              </tr>
            </thead>
            <tbody className="spectrum-Table-body" style={{ verticalAlign: 'middle' }}>
            {payloads.map((pl,index) => (
                <tr key={index} className="spectrum-Table-row">
                  <td className="spectrum-Table-cell">
                    <Checkbox
                      aria-label="Select payload"
                      isSelected={selectedPayloads.has(pl['call-time'])}
                      onChange={() => {
                        // Toggle payload selection
                        if (selection.has(pl['call-time'])) {
                          console.log("payload is already selected deleting");
                          selection.delete(pl['call-time']);
                        } else {
                          console.log("payload is NOT already selected",pl['call-time']);
                          selection.add(pl['call-time']);
                        }

                        setSelectedPayloads(new Set(selection));
                      }}
                    />
                  </td>

                  <td className="spectrum-Table-cell">
                      <span>
                        {pl['call-time']}
                        <br />
                      </span>
                  </td>

                  <td className="spectrum-Table-cell">
                    <pre>{JSON.stringify(pl['payload'], null, 3)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Flex>

      <DialogContainer onDismiss={() => setDialogIsOpen(false)}>
        {isDialogOpen && (
          <AlertDialog
            title="Are you sure ?"
            variant="destructive"
            primaryActionLabel="Confirm"
            cancelLabel="Cancel"
            onPrimaryAction={async () => {
              setIsDeleting(true);
              console.log("calling to delete payload ids ",JSON.stringify(Array.from(selection)));
              const res = await actionWebInvoke(
                actions['payloads-delete'],
                actionCallHeaders,
                {
                  payloadIds: Array.from(selection)
                }
              );

              if (res.error) {
                alert(res.error.message);
              } else {
                setPayloads((payloads) => payloads.filter((payload) => !selection.has(payload.id)));
                selection.clear();
                setSelectedPayloads(new Set());
              }

              console.log(res);

              setIsDeleting(false);
            }}>
            <strong>
              {selection.size} payload{selection.size > 1 && 's'}
            </strong>{' '}
            will be deleted. Do you want to continue ?
          </AlertDialog>
        )}
      </DialogContainer>
    </View>
  );
};