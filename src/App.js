import { useState } from "react";
import './App.css';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@bootstrap-styled/v4';
import BootstrapProvider from '@bootstrap-styled/provider';

const testRecipient = '5C5555yEXUcmEJ5kkcCMvdZjUo7NGJiQJMS7vZXEeoMhj3VQ';
const testAmount = 123456;

function App({ }) {
  const [modalIsOpen, setModalIsOpen] = useState(true);

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
      testRecipient,
      testAmount
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
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
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
