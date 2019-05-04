import {Injectable} from '@angular/core';
import { TransactionService } from './transaction.service';
const Web3 = require('web3');
declare let window: any;
const BN = require('bn.js');

@Injectable()
export class TokenService {

  constructor(private tx: TransactionService) {}

  async createToken(networkClient, symbol) {

      // Create a new ERC20 token
      // const {
      //   meta: { receipt: { contractAddress: tokenAddress } }
      // } = await networkClient.createToken.send({ name, symbol });
      const {meta} = await networkClient.createToken.send({ symbol: symbol });
      this.tx.updateTx(meta.receipt, 'createToken');
      const tokenAddress = meta.receipt.contractAddress;

      // Check out the logs to see the token address
      console.log('Token Address: ' + tokenAddress);

      // Return the address
      return tokenAddress;

  }

  async setName(colonyClient, name) {

    // Set the token owner to be the colony contract. This will allow us to mint
    // and claim tokens using the colonyClient, which will then allow us to fund
    // domains and tasks within our colony.
    const {meta} = await colonyClient.tokenClient.setName.send({ name: name });
    this.tx.updateTx(meta.receipt, 'setName');

    // Get the owner of the token
    const tokenInfo = await colonyClient.tokenClient.getTokenInfo();

    // Check out the logs to see the owner of the token
    console.log('Token Owner: ' + tokenInfo);

    // Return tokenInfo
    return tokenInfo;

}

  async setTokenOwner(colonyClient, colonyAddress) {

      // Set the token owner to be the colony contract. This will allow us to mint
      // and claim tokens using the colonyClient, which will then allow us to fund
      // domains and tasks within our colony.
      const {meta} = await colonyClient.tokenClient.setOwner.send({ owner: colonyAddress });
      this.tx.updateTx(meta.receipt, 'setTokenOwner');

      // Get the owner of the token
      const tokenOwner = await colonyClient.tokenClient._contract.owner();

      // Check out the logs to see the owner of the token
      console.log('Token Owner: ' + tokenOwner);

      // Return tokenOwner
      return tokenOwner;

  }

  async mintTokens(colonyClient, amount) {

      // Mint tokens
      amount = new BN(amount);
      const {meta} = await colonyClient.mintTokens.send({ amount });
      console.log(meta);
      this.tx.updateTx(meta.receipt, 'mintTokens');

      // Get the total supply of tokens
      const totalSupply = await colonyClient.tokenClient.getTotalSupply.call();

      // Check out the logs to see the total supply of tokens
      console.log('Total Supply Amount: ' + totalSupply.amount);

      // Return the total supply of tokens
      return totalSupply;

  }

  async claimColonyFunds(colonyClient, token) {

    // Claim funds for our colony from our token
    const {meta} = await colonyClient.claimColonyFunds.send({ token });
    this.tx.updateTx(meta.receipt, 'claimColonyFunds');

    // Get the pot balance of our colony
    const potBalance = await colonyClient.getFundingPotBalance.call({
      potId: 1,
      token,
    });

    // Check out the logs to see the pot balance of our colony
    console.log('Colony Pot Balance: ' + potBalance.balance);

    // Return the pot balance of our colony
    return potBalance;

  }

  async moveFundsBetweenPots(colonyClient, fromPot, toPot, amount, token) {

    // Get the balance for the pot that funds were withdrawn from
    const fromPotBalanceBefore = await colonyClient.getFundingPotBalance.call({
      potId: fromPot,
      token,
    });

    // Get the balance for the pot that funds were deposited into
    const toPotBalanceBefore = await colonyClient.getFundingPotBalance.call({
      potId: toPot,
      token,
    });

    // Move funds between pots
    const {meta} = await colonyClient.moveFundsBetweenPots.send({
      fromPot,
      toPot,
      amount: new BN(amount),
      token,
    }, {gasPrice: 7002154, gasLimit: 420000});
    this.tx.updateTx(meta.receipt, 'moveFundsBetweenPots');

    // Get the balance for the pot that funds were withdrawn from
    const fromPotBalanceAfter = await colonyClient.getFundingPotBalance.call({
      potId: fromPot,
      token,
    });

    // Get the balance for the pot that funds were deposited into
    const toPotBalanceAfter = await colonyClient.getFundingPotBalance.call({
      potId: toPot,
      token,
    });

    // Check out the log to see the pot balance
    console.log('Pot Balance From (Before): ' + fromPotBalanceBefore.balance.toNumber());

    // Check out the log to see the pot balance
    console.log('Pot Balance To (Before): ' + toPotBalanceBefore.balance.toNumber());

    // Check out the log to see the pot balance
    console.log('Pot Balance From (After): ' + fromPotBalanceAfter.balance.toNumber());

    // Check out the log to see the pot balance
    console.log('Pot Balance To (After): ' + toPotBalanceAfter.balance.toNumber());

    // Return the balance for the pot that funds were deposited into
    return toPotBalanceAfter;
  }

  async claimPayout(colonyClient, taskId, role, token) {

    // Get the task payout for the given task and role
    const taskPayoutBefore = await colonyClient.getTaskPayout.call({
      taskId,
      role,
      token,
    });

    // Claim the task the payout for the given task and role
    const {meta} = await colonyClient.claimPayout.send({
      taskId,
      role,
      token,
    });
    this.tx.updateTx(meta.receipt, 'claimPayout');

    // Get the task payout for the given task and role
    const taskPayoutAfter = await colonyClient.getTaskPayout.call({
      taskId,
      role,
      token,
    });

    // Check out the logs to see the task payout amount before claim
    console.log('Task Payout Amount (Before): ' + taskPayoutBefore.amount);

    // Check out the logs to see the task payout amount after claim
    console.log('Task Payout Amount (After): ' + taskPayoutAfter.amount);

    // Return the task payout after claim
    return taskPayoutAfter;
  }

  async updateTokenDetails(tokenClient) {
    const obj = {
      getTokenInfo: {},
      getTotalSupply: null
    };
    await tokenClient.getTokenInfo.call().then(res => {
      obj.getTokenInfo = res;
    });
    await tokenClient.getTotalSupply.call().then(res => {
      obj.getTotalSupply = res.amount;
    });
    return obj;
  }

    async sendEther(colonyClient, to, amount) {

        const web3 = new Web3(window.web3.currentProvider);
        console.log(web3);

        amount = new BN(amount);

        // Get the colony ether balance before the transfer
        const balanceBefore = await web3.eth.getBalance(to);

        // Send the amount from the wallet to the colony
        const result = await colonyClient.adapter.wallet.send(to, amount);

        // Get the colony ether balance after the transfer
        const balanceAfter = await web3.eth.getBalance(to);

        // Check out the logs to see the colony ether balance before the transfer
        console.log('Colony Balance (Before):', balanceBefore.toString());

        // Check out the logs to see the colony ether balance after the transfer
        console.log('Colony Balance (After):', balanceAfter.toString());

        // Return the colony ether balance after the transfer
        return result;

    };

    convertETHtoWei(amount){
        const web3 = new Web3(window.web3.currentProvider);
        return web3.utils.toWei(amount.toString(), 'ether');
    }

    convertWeiToETH(amount){
        const web3 = new Web3(window.web3.currentProvider);
        return web3.utils.fromWei(amount.toString(), 'ether');
    }

  async getBalanceOf(tokenClient, addr) {
    return tokenClient.getBalanceOf.call({sourceAddress: addr});
  }

  async getToken(tokenClient) {
    return tokenClient.getToken.call();
  }

  async getTokenInfo(colonyClient) {
    return colonyClient.getTokenInfo.call();
  }

  async getTotalSupply(tokenClient) {
    return tokenClient.getTotalSupply.call();
  }

  async getAllowance(tokenClient, sourceAddr, userAddr) {
    return tokenClient.getAllowance.call({sourceAddress: sourceAddr, user: userAddr});
  }

  async approve(tokenClient, addr, amount) {
    const meta = await tokenClient.approve.send({user: addr, amount: new BN(amount)});
    this.tx.updateTx(meta.meta.receipt, 'approve');
    return meta;
  }

  async transfer(tokenClient, addr, amount) {
    return tokenClient.transfer.send({destinationAddress: addr, amount: new BN(amount)});
  }

  async transferFrom(tokenClient, sourceAddress, destinationAddress, amount) {
    return tokenClient.transferFrom.send({sourceAddress: sourceAddress, destinationAddress: destinationAddress, amount: new BN(amount)});
  }

  // Get the balance for the pot that funds were deposited into
  async getFundingPotBalance(colonyClient, potId, address) {
    return colonyClient.getFundingPotBalance.call({
      potId: Number(potId),
      token: address
    });
  }

  async getNonRewardPotsTotal(colonyClient, address) {
    return colonyClient.getNonRewardPotsTotal.call({
      token: address
    });
  }

  getMethods() {
    return [
      {
        name: 'Create Token',
        id: 'createToken',
        field: [
          {
            placeholder: 'Symbol',
            validation: 'string',
            id: 'createTokenSymbol'
          }
        ],
        docs: "Create a new ERC20 token contract."
      },
      {
        name: 'Set Token Name',
        id: 'setName',
        field: [
          {
            placeholder: 'Name',
            validation: 'string',
            id: 'setName'
          }
        ],
        docs: "Set the name of a token contract. This function can only be called by the current owner of the contract. In order to call token contract methods from within a colony, the token owner must be the address of the colony contract."
      },
      {
        name: 'Set Token Owner',
        id: 'setTokenOwner',
        field: [
            {
                placeholder: 'Colony Address',
                validation: 'address',
                id: 'setTokenOwnerAddress'
            }
        ],
        docs: "Set the owner of a token contract. This function can only be called by the current owner of the contract. In order to call token contract methods from within a colony, the token owner must be the address of the colony contract."
      },
      {
        name: 'Mint Tokens',
        id: 'mintTokens',
        field: [
          {
            placeholder: 'Amount',
            validation: 'number',
            id: 'mintTokensAmount'
          }            
        ],
        docs: "Mint new tokens. This function can only be called if the address of the colony contract is the owner of the token contract. If this is the case, then this function can only be called by the user assigned the FOUNDER authority role."
      },
      {
        name: 'Claim Colony Funds',
        id: 'claimColonyFunds',
        field: [
          {
            placeholder: 'Token Address',
            validation: 'address',
            id: 'claimColonyFundsAddress'
          }
        ],
        docs: "Claim funds that the colony has received by adding them to the funding pot of the root domain. A small fee is deducted from the funds claimed and added to the colony rewards pot. No fee is deducted when tokens native to the colony are claimed."
      },
      {
        name: 'Move Funds Between Pots',
        id: 'moveFundsBetweenPots',
        field: [
          {
            placeholder: 'From Pot',
            validation: 'number',
            id: 'moveFundsBetweenPotsFrom'
          },
          {
            placeholder: 'To Pot',
            validation: 'number',
            id: 'moveFundsBetweenPotsTo'
          },
          {
            placeholder: 'Amount',
            validation: 'number',
            id: 'moveFundsBetweenPotsAmount'
          },
          {
            placeholder: 'Token Address',
            validation: 'address',
            id: 'moveFundsBetweenPotsAddress'
          }
        ],
        docs: "Move funds from one pot to another."
      },
      {
        name: 'Claim Payout',
        id: 'claimPayout',
        field: [
          {
            placeholder: 'Task ID',
            validation: 'number',
            id: 'claimPayoutTaskID'
          },
          {
            placeholder: 'Role',
            validation: 'role',
            id: 'claimPayoutRole'
          },
          {
            placeholder: 'Token Address',
            validation: 'address',
            id: 'claimPayoutAddress'
          }
        ],
        docs: "Claim the payout assigned to a task role. This function can only be called by the user who is assigned a task role (MANAGER,  EVALUATOR, or WORKER) after the task has been finalized."
      },
      {
        name: 'Transfer',
        id: 'transfer',
        field: [
          {
            placeholder: 'Address',
            validation: 'address',
            id: 'transferAddress'
          },
          {
            placeholder: 'Amount',
            validation: 'number',
            id: 'transferAmount'
          }
        ],
        docs: "Transfer tokens from the address calling the function to another address. The current address must have a sufficient token balance."
      },
      {
        name: 'Transfer From',
        id: 'transferFrom',
        field: [
          {
            placeholder: 'Source Address',
            validation: 'address',
            id: 'transferFromSourceAddress'
          },
          {
            placeholder: 'Destination Address',
            validation: 'address',
            id: 'transferFromDestinationAddress'
          },
          {
            placeholder: 'Amount',
            validation: 'number',
            id: 'transferFromAmount'
          }
        ],
        docs: "Transfer tokens from one address to another address. The address the tokens are transferred from must have a sufficient token balance and it must have a sufficient token allowance approved by the token owner."
      },
      {
        name: 'Get Funding Pot Balance',
        id: 'getFundingPotBalance',
        field: [
          {
            placeholder: 'Pot ID',
            validation: 'number',
            id: 'getFundingPotBalancePotID'
          },
          {
            placeholder: 'Address',
            validation: 'address',
            id: 'getFundingPotBalanceAddress'
          }
        ],
        docs: "Get the balance of a funding pot."
      },
      {
        name: 'Get Non Reward Pots Total',
        id: 'getNonRewardPotsTotal',
        field: [
          {
            placeholder: 'Token Address (empty if ETH)',
            validation: 'address',
            id: 'getNonRewardPotsTotalAddress'
          }
        ],
        docs: "Get the total amount of funds that are not in the colony rewards pot. The total amount of funds that are not in the colony rewards pot is a value that keeps track of the total assets a colony has to work with, which may be split among several distinct pots associated with various domains and tasks."
      },
      {
        name: 'Get Balance Of',
        id: 'getBalanceOf',
        field: [
          {
            placeholder: 'Address',
            validation: 'address',
            id: 'balanceOfAddress'
          }
        ],
        docs: "Get the the token balance of an address."
      },
      {
        name: 'Get Token',
        id: 'getToken',
        docs: "Get the address of the token contract that is the native token assigned to the colony. The native token is the token used to calculate reputation scores, i.e. 1 token earned for completing a task with an adequate rating (2) will result in 1 reputation point earned."
      },
      {
        name: 'Get Token Info',
        id: 'getTokenInfo',
        docs: "Get information about the token."
      },
      {
        name: 'Get Total Supply',
        id: 'getTotalSupply',
        docs: "Get the total supply of the token."
      },
      {
        name: 'Approve Tokens',
        id: 'approve',
        field: [
          {
            placeholder: 'Spender Address',
            validation: 'address',
            id: 'approveTokensAddress'
          },
          {
            placeholder: 'Amount',
            validation: 'number',
            id: 'approveTokensAmount'
          }
        ],
        docs: "Approve a token allowance. This function can only be called by the token owner. The allowance is the amount of tokens that the  spender is authorized to transfer using the transferFrom function."
      },
      {
        name: 'Get Allowance',
        id: 'getAllowance',
        field: [
          {
            placeholder: 'Source Address (token owner)',
            validation: 'address',
            id: 'allowanceSourceAddress'
          },
          {
            placeholder: 'User Address',
            validation: 'address',
            id: 'allowanceUserAddress'
          }
        ],
        docs: "Get the token allowance of an address. The allowance is the amount of tokens that the spender is authorized to transfer using the transferFrom function."
      },
      {
        name: 'Send Ether',
        id: 'sendEther',
        field: [
          {
            placeholder: 'To',
            validation: 'address',
            id: 'sendEtherAddress'
          },
          {
            placeholder: 'Amount (in wei)',
            validation: 'number',
            id: 'sendEtherAmount'
          }
        ],
        docs: "Send an amount of ether to an address"
      },
      {
        name: 'Convert ETH to Wei',
        id: 'convertETHtoWei',
        field: [
          {
            placeholder: 'Amount in ETH',
            validation: 'number',
            id: 'convertETHtoWei'
          }
        ],
        docs: "Convert the domination amount from Ether to Wei (smallest denomination)"
      },
      {
        name: 'Convert Wei to ETH',
        id: 'convertWeiToETH',
        field: [
          {
            placeholder: 'Amount in Wei',
            validation: 'number',
            id: 'convertWeiToETH'
          }
        ],
        docs: "Convert the domination amount from Wei (smallest denomination) to Ether"
      }
    ]
  }
}
