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

const selection = new Set();

export const PayloadList = ({ actionCallHeaders, props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [payloads, setPayloads] = useState(true);
  const [selectedPayloads, setSelectedPayloads] = useState(selection);
  const [isDialogOpen, setDialogIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedLearnerObject, setLearnerObject] = useState();
  const history = useHistory();

  const JsonConfig = {
    type: "front end",
    items: [{ name: 10, url: true }]
  };

  useEffect(() => {
    (async () => {
      const res = await actionWebInvoke(`${actions['payloads-list']}?leaner_id=leaner1`,actionCallHeaders);

      if (res.error) {
        alert(res.error.message);
      } else {
        setPayloads(res.reverse());
      }

      console.log(res);
      console.log("payloads after load",payloads);

      setIsLoading(false);
    })();
  }, []);

  const handleLearnerInputChange = (learner) => {
    console.log(`in payload list setting learner object`);
    console.log(learner);
    setLearnerObject(learner);
  };

  return (
    <View elementType="main" minHeight="100vh" marginX="size-400">
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
                      isSelected={selectedPayloads.has(pl.webhook_receive_id)}
                      onChange={() => {
                        // Toggle payload selection
                        if (selection.has(pl.webhook_receive_id)) {
                          console.log("payload is already selected deleting");
                          selection.delete(pl.webhook_receive_id);
                        } else {
                          console.log("payload is NOT already selected",pl.webhook_receive_id);
                          selection.add(pl.webhook_receive_id);
                        }

                        setSelectedPayloads(new Set(selection));
                      }}
                    />
                  </td>

                  <td className="spectrum-Table-cell">
                      <span>
                        {pl.webhook_receive_id}
                        <br />
                      </span>
                  </td>

                  <td className="spectrum-Table-cell">
                    <pre>{JSON.stringify(pl.params, null, 3)}</pre>
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