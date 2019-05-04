import {Injectable} from '@angular/core';
import { TransactionService } from './transaction.service';
const Web3 = require('web3');

@Injectable()
export class ColonyClientService {

  constructor(private tx: TransactionService) {

  }

    // An example using the createColony method
    async createColony(networkClient, tokenAddress) {

        // Create a colony with the given token
        //const meta = await networkClient.createColony.send({ tokenAddress }, { gasLimit: 4432466, timeoutMs: 4000 });
        const meta = await networkClient.createColony.send({ tokenAddress });
        this.tx.updateTx(meta.meta.receipt, 'createColony');
        const colonyAddress = meta.eventData.colonyAddress;
        const colonyId = meta.eventData.colonyId;

        // Check out the logs to see our new colony address
        console.log('Colony Address:', colonyAddress);

        // Check out the logs to see our new colony id
        console.log('Colony ID:', colonyId);

        // Return our new colony
        return {
            address: colonyAddress,
            id: colonyId,
        };

    }

    async getColonyClient(networkClient, colonyId) {

        // Get the colonyClient using the colonyId
        const colonyClient = await networkClient.getColonyClient(colonyId);

        // Check out the logs to see the address of the colonyClient
        console.log('Colony Address:', colonyClient.contract.address);

        // Return the colonyClient
        return colonyClient;
    }

    async getColonyClientByAddress(networkClient, colonyAddress) {

        // Alternatively, we can get the colonyClient using the colonyAddress
        const colonyClient = await networkClient.getColonyClientByAddress(
          colonyAddress,
        );

        // Check out the logs to see the address of the colonyClient
        console.log('Colony Address:', colonyClient.contract.address);

        // Return the colonyClient
        return colonyClient;
    }

    async hasUserRole(colonyClient, user, role) {
        const userRole = await colonyClient.hasUserRole.call({
            user,
            role
        });
        return userRole;
    }

    async setAdminRole(colonyClient, user) {
        const adminRole = await colonyClient.setAdminRole.send({user});
        return adminRole;
    }

    async getVersion(colonyClient) {
        return await colonyClient.getVersion.call();
    }

    async isInRecoveryMode(colonyClient) {
        return await colonyClient.isInRecoveryMode.call();
    }

    getMethods() {
        return [
          {
            name: 'Create Colony',
            id: 'createColony',
            field: [
              {
                placeholder: 'Token Address',
                validation: 'address',
                id: 'createColonyTokenAddress'
              }
            ],
            docs: "Create a new colony on the network."
          },
          {
            name: 'Get Colony Client',
            id: 'getColonyClient',
            field: [
              {
                placeholder: 'Colony ID',
                validation: 'number',
                id: 'getColonyClientID'
              }
            ],
            docs: "Returns an initialized ColonyClient for the specified id of a deployed colony contract."
          },
          {
            name: 'Get Colony Client By Address',
            id: 'getColonyClientByAddress',
            field: [
              {
                placeholder: 'Colony Address',
                validation: 'address',
                id: 'getColonyClientAddress'
              }
            ],
            docs: "Returns an initialized ColonyClient for the contract at address contractAddress."
          },
          {
            name: 'Get Version',
            id: 'getVersion',
            docs: "Get the version number of the colony contract. The version number starts at 1 and is incremented by 1 with every new version."
          },
          {
            name: 'Has User Role',
            id: 'hasUserRole',
            field: [
              {
                placeholder: 'User Address',
                validation: 'address',
                id: 'hasUserRoleAddress'
              },
              {
                placeholder: 'Role',
                validation: 'role',
                id: 'hasUserRoleRole'
              }
            ],
            docs: "Check whether a user has an authority role."
          },
          {
            name: 'Set Admin Role',
            id: 'setAdminRole',
            field: [
              {
                placeholder: 'User Address',
                validation: 'address',
                id: 'setAdminRoleAddress'
              }
            ],
            docs: "Assign the ADMIN authority role to a user. This function can only be called by the user assigned the FOUNDER authority role or a user assigned the ADMIN authority role. There is no limit to the number of users that can be assigned the ADMIN authority role."
          },
          {
            name: 'Is In Recovery Mode',
            id: 'isInRecoveryMode',
            docs: "Check whether or not the colony is in recovery mode."
          },
        ]
    }
}
