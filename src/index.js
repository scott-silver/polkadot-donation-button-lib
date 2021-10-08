import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

window.initPolkadotDonationButton = ( { recipientPolkadotAddress } ) => {
  const element = document.getElementById('polkadot-modal-root');

  ReactDOM.render(
    <App
      polkadotAddress={recipientPolkadotAddress}
      onClose={() => {
        ReactDOM.unmountComponentAtNode(element);
      }}
    />,
    element
  );
}
