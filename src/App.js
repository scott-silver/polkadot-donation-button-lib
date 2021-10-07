import { useState } from "react";
import './App.css';
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

function App({ polkadotAddress }) {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [donationAmount, setDonationAmount] = useState(123456);

  const initiateDonation = async () => {
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });

    const extensions = await web3Enable('Polkadot Donation');

    if (extensions.length === 0) {
      // there's no extension; point the user to an extension they can download
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
          // display confirmation message
        } else {
          // display status
        }
    }).catch((error: any) => {
      // display failure status
    });
  }

  return (
    <BootstrapProvider theme={{"$modal-dialog-bg": "purple"}}>
      <Modal isOpen={modalIsOpen} toggle={() => setModalIsOpen(false)}>
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

        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => initiateDonation()}
          >Make Donation</Button>
          <Button color="secondary" onClick={() => setModalIsOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </BootstrapProvider>
  );
}

export default App;
