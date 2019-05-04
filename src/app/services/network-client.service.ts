import {Injectable} from '@angular/core';
import { PurserService } from './purser.service';
import { environment } from 'src/environments/environment.prod';
const Web3 = require('web3');
declare let window: any;
const assist = window.assist;

// Import the prerequisites
const { providers, Wallet } = require('ethers');
const { default: EthersAdapter } = require('@colony/colony-js-adapter-ethers');
//const { default: NetworkLoader } = require('@colony/colony-js-contract-loader-network');
const { TrufflepigLoader } = require('@colony/colony-js-contract-loader-http');
const { getNetworkClient } = require('@colony/colony-js-client');

// Import the ColonyNetworkClient
const { default: ColonyNetworkClient } = require('@colony/colony-js-client');

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
export class NetworkClientService {

    constructor(private ps: PurserService) {}

    // An example method for connecting to the local network
    async connectNetwork(accountIndex) {
        console.log(providers);
        console.log(Wallet);

        // Create an instance of the Trufflepig contract loader
        const loader = new TrufflepigLoader();

        // Create a provider for local TestRPC (Ganache)
        const provider = new providers.JsonRpcProvider('http://localhost:8545/');
        // Get the private key from the first Ganache test account
        const { privateKey } = await loader.getAccount(accountIndex || 0);

        // Create a wallet with the private key (so we have a balance we can use)
        const wallet = new Wallet(privateKey, provider);
        console.log(wallet);

        // Create an adapter (powered by ethers)
        const adapter = new EthersAdapter({
            loader,
            provider,
            wallet,
        });

        // Connect to ColonyNetwork with the adapter!
        const networkClient = new ColonyNetworkClient({ adapter });

        // Initialize networkClient
        await networkClient.init();

        // Check out the logs to see the address of the contract signer
        console.log('Account Address: ' + networkClient._contract.signer.address);

        // Check out the logs to see the address of the deployed network
        console.log('Network Address: ' + networkClient._contract.address);

        // Return networkClient
        return networkClient;

    }

    async connectNetworkRinkeby(choice) {
        let wallet;
        switch (choice) {
            case 'metamask':
                wallet = await this.ps.metamask();
                break;
            case 'trezor':
                wallet = await this.ps.trezor();
                break;        
            default:
                console.log('invalid choice');
                break;
        }

        const networkClient = await getNetworkClient('rinkeby', wallet);

        // // Connect to ColonyNetwork with the adapter!
        // const networkClient = new ColonyNetworkClient({ adapter });
        console.log(networkClient);

        // Return networkClient
        return networkClient;

    }

    getWeb3() {
        return new Web3(window.web3.currentProvider);
    }

    blockNative(){
        //const web3 = new Web3(window.web3.currentProvider);
        var config = {
            dappId: environment.BLOCK_NATIVE_KEY,
            networkId: 4,
            messages: {
                txConfirmed: function(data) {
                    console.log(data);
                  if (data.contract.methodName === 'addDomain') {
                    return 'Congratulations! You added a domain to the Colony'
                  }
                },
                txPending: function(data) {
                    console.log(data);
                }
            }
            // images: {
            //     welcome: {
            //       src: String, // Image URL for welcome onboard modal
            //       srcset: String // Image URL(s) for welcome onboard modal
            //     },
            //     complete: {
            //       src: String, // Image URL for complete onboard modal
            //       srcset: String // Image URL(s) for complete onboard modal
            //     }
            // }
        };
        var assistInstance = assist.init(config);
        console.log(assistInstance);

        // Cannot read property 'getData' of undefined
        // var myContract = web3.eth.Contract(abi, "0xaAD77A45Aeef1e73465aa333b86f7Ede98beBA15");
        // var decoratedContract = assistInstance.Contract(myContract);
        // console.log(decoratedContract); 

        return assistInstance.onboard()
            .then(function(success) {
                if (success) return true;


                // User has been successfully onboarded and is ready to transact
            // This means we can be sure of the follwing user properties:
            //  - They are using a compatible browser
            //  - They have a web3-enabled wallet installed
            //  - The wallet is connected to the config-specified networkId
            //  - The wallet is unlocked and contains at least `minimumBalance` in wei
            //  - They have connected their wallet to the dapp, congruent with EIP1102
            })
            .catch(function(error) {
            // The user exited onboarding before completion
            // Will let you know what stage of onboarding the user was up to when they exited
            console.log(error.msg);
            });
    }

    async getMetaColonyClient(networkClient) {
        console.log(networkClient);
        return await networkClient.getMetaColonyClient.call();
    }

    async getMetaColonyAddress(networkClient) {
        return await networkClient.getMetaColonyAddress.call();
    }

    async isInRecoveryMode(networkClient) {
        return await networkClient.isInRecoveryMode.call();
    }

    getMethods() {
        return [
          {
            name: 'Get Meta Colony Client',
            id: 'getMetaColonyClient',
            docs: "Get the Meta Colony as an initialized ColonyClient"
          },
          {
            name: 'Get Meta Colony Address',
            id: 'getMetaColonyAddress',
            docs: "Get the Meta Colony contract address."
          },
          {
            name: 'Is In Recovery Mode',
            id: 'isInRecoveryMode',
            docs: "Check whether or not the network is in recovery mode."
          }
        ]
    }

}
