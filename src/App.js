import React, { useState } from "react";
// import './App.css';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@bootstrap-styled/v4';
import BootstrapProvider from '@bootstrap-styled/provider';

const DONATION_STATUS_READY = 0;
const DONATION_STATUS_REQUEST_PENDING = 1;
const DONATION_STATUS_REQUEST_SUCCESS = 2;
const DONATION_STATUS_REQUEST_FAILED = 3;
const DONATION_STATUS_NO_EXTENSION = 4;

function displayStringForDonationStatus(donationStatus) {
  switch (donationStatus) {
    case DONATION_STATUS_READY:
      return "ready";
    case DONATION_STATUS_REQUEST_PENDING:
      return "pending";
    case DONATION_STATUS_REQUEST_SUCCESS:
      return "donation succeeded!";
    case DONATION_STATUS_REQUEST_FAILED:
      return "donation failed";
    case DONATION_STATUS_NO_EXTENSION:
      return "no extension found";
    default:
      return "no status";
  }
}

function App({ polkadotAddress, onClose }) {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [donationAmount, setDonationAmount] = useState(123456);
  const [donationStatus, setDonationStatus] = useState(DONATION_STATUS_READY);

  const closeModal = () => {
    setModalIsOpen(false);
    onClose();
  }

  const initiateDonation = async () => {
    setDonationStatus(DONATION_STATUS_REQUEST_PENDING);
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });

    const extensions = await web3Enable('Polkadot Donation');

    if (extensions.length === 0) {
      // there's no extension; point the user to an extension they can download
      setDonationStatus(DONATION_STATUS_NO_EXTENSION);
      return;
    }

    const allAccounts = await web3Accounts();

    const account = allAccounts[0];

    const transferExtrinsic = api.tx.balances.transfer(
      polkadotAddress,
      donationAmount
    );

    const injector = await web3FromSource(account.meta.source);

    transferExtrinsic.signAndSend(
      account.address,
      { signer: injector.signer },
      ({ status }) => {
        if (status.isInBlock) {
          setDonationStatus(DONATION_STATUS_REQUEST_SUCCESS);
        } else {
          // display status
        }
    }).catch((error) => {
      setDonationStatus(DONATION_STATUS_REQUEST_FAILED);
    });
  }

  return (
    <BootstrapProvider theme={{"$modal-dialog-bg": "purple"}}>
      <Modal isOpen={modalIsOpen} toggle={closeModal}>
        <ModalHeader>Make a Donation with Polkadot</ModalHeader>
        <ModalBody>
          <Form>

            <FormGroup>
              <Label>
                Recipient address
              </Label>
              <Input
                type="text"
                style={{boxSizing: "border-box"}}
                disabled={true}
                value={polkadotAddress}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Donation amount (DOT)
              </Label>
              <Input
                type="text"
                style={{boxSizing: "border-box"}}
                value={donationAmount}
                onChange={e => setDonationAmount(e.target.value)}
              />
            </FormGroup>

          </Form>

          <div>
            Status: {displayStringForDonationStatus(donationStatus)}
          </div>

        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="primary"
            onClick={() => initiateDonation()}
            disabled={donationStatus !== DONATION_STATUS_READY}
          >Make Donation</Button>
          <Button
            size="sm"
            color="secondary"
            onClick={closeModal}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </BootstrapProvider>
  );
}

export default App;
