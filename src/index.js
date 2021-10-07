import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

window.initPolkadotDonationButton = ( { recipientPolkadotAddress } ) => {
  ReactDOM.render(
    <App />,
    document.getElementById('polkadot-modal-root')
  );
}
