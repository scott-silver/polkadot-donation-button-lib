import { useEffect } from "react";
import './App.css';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

function App() {

  const getProvider = async () => {
    // console.log('getProvider called');
    // // Construct
    // const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    // const api = await ApiPromise.create({ provider: wsProvider });

    // // Do something
    // console.log(api.genesisHash.toHex());

    const extensions = await web3Enable('my cool dapp');

    console.log(extensions);

    if (extensions.length === 0) {
      // there's no extension; point the user to an extension they can download
      return;
    }

    const allAccounts = await web3Accounts();

    console.log(allAccounts);


  }

  useEffect(() => {
    getProvider();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          hello
        </p>
      </header>
    </div>
  );
}

export default App;
