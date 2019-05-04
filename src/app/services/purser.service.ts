import {Injectable} from '@angular/core';
import {WalletInstance} from '../models/wallet';
import metamask from '@colony/purser-metamask';
import trezor from '@colony/purser-trezor';
// import { open } from '@colony/purser-metamask';
import { detect as isMetamaskAvailable } from '@colony/purser-metamask';
import { TransactionService } from './transaction.service';


// Define get nework method
const getNetworkFromId = (id) => {
    return {
      1: 'mainnet',
      3: 'ropsten',
      4: 'rinkeby',
      42: 'kovan',
    }[id];
};

@Injectable()
export class PurserService {
  metamaskWallet = new WalletInstance();

  constructor(private tx: TransactionService) {

  }

  async metamask() {
    const available = await isMetamaskAvailable();
    if(!available) console.log('metamask not available');
    this.metamaskWallet = await metamask.open();
    return this.metamaskWallet;
  }

  async trezor() {
    const wallet = await trezor.open({chainId: 4});
    console.log(wallet);
    return wallet;
  }
}
