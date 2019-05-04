import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
const { TrufflepigLoader } = require('@colony/colony-js-contract-loader-http');
import { State } from '../models/state';
// declare let require: any;
// declare let window: any;

@Injectable()
export class StateService {

    private master: State = {
        network: {
            address: '',
            provider: '',
            signerAddr: '',
        },
        token: {
            address: '',
            owner: '',
            name: '',
            symbol: '',
            decimals: 0,
            minted: 0,
            totalSupply: 0,
            potBalance: 0,
            toPotBalanceAfter: 0,
            userBalance: 0,
        },
        colony: {
            id: 0,
            address: '',
            hasUserRole: false
        },
        domain: {
            id: 0,
            localSkillId: 0,
            potId: 0,
        },
        skill: {
            id: 0,
            parentSkillId: 0,
            nParents: 0,
            nChildren: 0,
            isGlobalSkill: false,
        },
        task: {
            title: '',
            description: '',
            completionDate: '',
            deliverableHash: '',
            domainId: 0,
            dueDate: new Date,
            id: 0,
            payoutsWeCannotMake: 0,
            potId: 0,
            specificationHash: '',
            status: '',
            sign: {
                signSetTaskSkill: false,
                signSetTaskDueDate: false,
                signRemoveTaskEvaluatorRole: false,
                signSetTaskEvaluatorRole: false,
                signSetTaskWorkerRole: false,
                signSetTaskBrief: false,
            },
            payout: {
                manager: 0,
                evaluator: 0,
                worker: 0,
            },
            submit: {

            }
        }
    }

  public masterObservable = new Subject<{}>();
  private accounts: Array<string[]> = [];

  public componentSelectionObservable = new Subject<string>();
  // private radioButton$: string;

  public stateObservable = new Subject<any[]>();
  private state$: Array<any> = [];

//   public stateObservableEval = new Subject<any[]>();
//   private stateEval$: Array<any> = [];

//   public stateObservableWorker = new Subject<any[]>();
//   private stateWorker$: Array<any> = [];

  constructor() {
    this.watchState();
    // this.watchStateEval();
    // this.watchStateWorker();
    this.watchMaster();
  }

  updateState(state) {
    this.stateObservable.next(state);
  }

  watchState() {
    this.stateObservable.subscribe((state) => {
      this.state$.push(state);
      console.log(this.state$);
    });
  }

  getState() {
    return this.state$;
  }

  updateMaster(value) {
    this.masterObservable.next(value);
  }

  watchMaster() {
    this.masterObservable.subscribe((arrayObj) => {
        console.log(arrayObj);
      this.master[arrayObj[0]] = arrayObj[1];
      console.log(this.master);
    });
  }

  getMaster() : State {
      return this.master;
  }





//   /****** EVALUATOR **********/
//   updateStateEval(state) {
//     this.stateObservableEval.next(state);
//   }

//   watchStateEval() {
//     this.stateObservableEval.subscribe((state) => {
//       this.stateEval$.push(state);
//       console.log(this.stateEval$);
//     });
//   }

//   getStateEval() {
//     return this.stateEval$;
//   }

//   /****** WORKER **********/
//   updateStateWorker(state) {
//     this.stateObservableWorker.next(state);
//   }

//   watchStateWorker() {
//     this.stateObservableWorker.subscribe((state) => {
//       this.stateWorker$.push(state);
//       console.log(this.stateWorker$);
//     });
//   }

//   getStateWorker() {
//     return this.stateWorker$;
//   }

  async getAccounts() {
    const loader = new TrufflepigLoader();
    for (let index = 0; index < 3; index++) {
        const {address} = await loader.getAccount(index);
        this.accounts.push(address);
    }
    return this.accounts;
  }

  updateComponentSelection(section){
    this.componentSelectionObservable.next(section);
  }

  getTodo() {
    return [
      /************** COLONY ********************/
      {
        name: "Get Meta Colony Client",
        type: "network",
        comment: "ERROR: Cannot read property 'getMetaColonyAddress' of undefined. Read docs",
        docs: "Get the Meta Colony as an initialized ColonyClient"
      },
      {
        name: "Get Meta Colony Address",
        type: "network",
        comment: "GOOD. Returns address: 0x1A22d5CEcCa2a4E0f6E667f2033c22c93fEA476e",
        docs: "Get the Meta Colony contract address."
      },
      {
        name: "Is In Recovery Mode",
        type: "network",
        comment: "GOOD. Returns boolean",
        docs: "Check whether or not the network is in recovery mode."
      },
      {
        name: "Create Colony",
        type: "colony",
        comment: "GOOD. Returns Colony ID",
        docs: "Create a new colony on the network."
      },
      {
        name: "Get Colony Client",
        type: "colony",
        comment: "GOOD. Returns client",
        docs:
          "Returns an initialized ColonyClient for the specified id of a deployed colony contract."
      },
      {
        name: "Get Colony Client By Address",
        type: "colony",
        comment: "GOOD. Returns client",
        docs:
          "Returns an initialized ColonyClient for the contract at address contractAddress."
      },
      {
        name: "Get Version",
        type: "colony",
        comment: "GOOD. Returns version number",
        docs:
          "Get the version number of the colony contract. The version number starts at 1 and is incremented by 1 with every new version."
      },
      {
        name: "Has User Role",
        type: "colony",
        comment: "GOOD. Returns boolean",
        docs: "Check whether a user has an authority role."
      },
      {
        name: "Set Admin Role",
        type: "colony",
        comment: "GOOD. Returns object: eventData, meta, successful",
        docs:
          "Assign the ADMIN authority role to a user. This function can only be called by the user assigned the FOUNDER authority role or a user assigned the ADMIN authority role. There is no limit to the number of users that can be assigned the ADMIN authority role."
      },
      {
        name: "Is In Recovery Mode",
        type: "colony",
        comment: "GOOD. Returns boolean",
        docs: "Check whether or not the colony is in recovery mode."
      },
      /************** TOKEN **************/
      {
        name: "Create Token",
        type: "token",
        comment: "GOOD. Returns address. Move to network client (along with others)?",
        docs: "Create a new ERC20 token contract."
      },
      {
        name: "Set Token Name",
        type: "token",
        comment: "ERROR: Function setName not found on contract",
        docs:
          "Set the name of a token contract. This function can only be called by the current owner of the contract. In order to call token contract methods from within a colony, the token owner must be the address of the colony contract."
      },
      {
        name: "Set Token Owner",
        type: "token",
        comment: "GOOD. Need to allow user to set gasPrice and gasLimit. Returns owner address",
        docs:
          "Set the owner of a token contract. This function can only be called by the current owner of the contract. In order to call token contract methods from within a colony, the token owner must be the address of the colony contract."
      },
      {
        name: "Mint Tokens",
        type: "token",
        comment: "GOOD. Returns total amount as hex",
        docs:
          "Mint new tokens. This function can only be called if the address of the colony contract is the owner of the token contract. If this is the case, then this function can only be called by the user assigned the FOUNDER authority role."
      },
      {
        name: "Claim Colony Funds",
        type: "token",
        comment: "GOOD. Returns total balance as hex",
        docs:
          "Claim funds that the colony has received by adding them to the funding pot of the root domain (for example, once they've been minted). A small fee is deducted from the funds claimed and added to the colony rewards pot. No fee is deducted when tokens native to the colony are claimed."
      },
      {
        name: "Move Funds Between Pots",
        type: "token",
        comment: "GOOD. Need to allow user to set gasPrice and gasLimit. Returns pot balance as hex",
        docs: "Move funds from one pot to another."
      },
      {
        name: "Claim Payout",
        type: "token",
        comment: "",
        docs:
          "Claim the payout assigned to a task role. This function can only be called by the user who is assigned a task role (MANAGER,  EVALUATOR, or WORKER) after the task has been finalized."
      },
      {
        name: "Transfer",
        type: "token",
        comment: "",
        docs:
          "Transfer tokens from the address calling the function to another address. The current address must have a sufficient token balance."
      },
      {
        name: "Transfer From",
        type: "token",
        comment: "",
        docs:
          "Transfer tokens from one address to another address. The address the tokens are transferred from must have a sufficient token balance and it must have a sufficient token allowance approved by the token owner."
      },
      {
        name: "Get Funding Pot Balance",
        type: "token",
        comment: "GOOD. Returns balance as hex",
        docs: "Get the balance of a funding pot."
      },
      {
        name: "Get Non Reward Pots Total",
        type: "token",
        comment: "GOOD. Returns balance as hex",
        docs:
          "Get the total amount of funds that are not in the colony rewards pot. The total amount of funds that are not in the colony rewards pot is a value that keeps track of the total assets a colony has to work with, which may be split among several distinct pots associated with various domains and tasks."
      },
      {
        name: "Get Balance Of",
        type: "token",
        comment: "GOOD. Returns balance as hex",
        docs: "Get the the token balance of an address."
      },
      {
        name: "Get Token",
        type: "token",
        comment: "GOOD. Returns address of token",
        docs:
          "Get the address of the token contract that is the native token assigned to the colony. The native token is the token used to calculate reputation scores, i.e. 1 token earned for completing a task with an adequate rating (2) will result in 1 reputation point earned."
      },
      {
        name: "Get Token Info",
        type: "token",
        comment: "GOOD. Returns name, symbol, and decimal",
        docs: "Get information about the token."
      },
      {
        name: "Get Total Supply",
        type: "token",
        comment: "Good. Returns balance as hex",
        docs: "Get the total supply of the token."
      },
      {
        name: "Approve Tokens",
        type: "token",
        comment: "GOOD. Returns tx object - eventData, meta, successful",
        docs:
          "Approve a token allowance. This function can only be called by the token owner. The allowance is the amount of tokens that the  spender is authorized to transfer using the transferFrom function."
      },
      {
        name: "Get Allowance",
        type: "token",
        comment: "GOOD. Returns allowance amount BN",
        docs:
          "Get the token allowance of an address. The allowance is the amount of tokens that the spender is authorized to transfer using the transferFrom function."
      },
      {
        name: "Send Ether",
        type: "token",
        comment: "GOOD. Returns tx hash object",
        docs: "Send an amount of ether to an address"
      },
      {
        name: "Convert ETH to Wei",
        type: "token",
        comment: "GOOD. Helper function",
        docs:
          "Convert the domination amount from Ether to Wei (smallest denomination)"
      },
      {
        name: "Convert Wei to ETH",
        type: "token",
        comment: "GOOD. Helper function",
        docs:
          "Convert the domination amount from Wei (smallest denomination) to Ether"
      },
      /************** DOMAIN **************/
      {
        name: "Add Domain",
        type: "domain",
        comment: "",
        docs:
          "Add a domain to the colony. Adding new domains is currently retricted to one level, i.e. the parentDomainId must be the id of the root domain 1, which represents the colony itself."
      },
      {
        name: "Get Domain",
        type: "domain",
        comment: "",
        docs: "Get information about a domain."
      },
      {
        name: "Get Domain Count",
        type: "domain",
        comment: "",
        docs:
          "Get the total number of domains in the colony. The return value is also the ID of the last domain created."
      },
      {
        name: "Get Skill",
        type: "domain",
        comment: "",
        docs: "Get information about a skill."
      },
      {
        name: "Get Skill Count",
        type: "domain",
        comment: "",
        docs: "Get the total number of global and local skills in the network."
      },
      {
        name: "Add Skill",
        type: "domain",
        comment: "",
        docs:
          "Add a new global or local skill to the skills tree. Select TRUE for global, FALSE for local. Global skill can only be called from the Meta Colony and only by the user assigned the FOUNDER role."
      },
      {
        name: "Get Parent Skill ID",
        type: "domain",
        comment: "",
        docs: "Get the ID of a parent or child skill."
      },
      /***************** TASK **********************/
      {
          name: 'Create Task',
          type: "task",
          comment: 'GOOD. Returns task OBJ',
          docs: "Create a new task within the colony."
        },
        {
          name: 'Get Task',
          type: "task",
          comment: '',
          docs: ""
        },
        {
          name: 'Cancel Task',
          type: "task",
          comment: '',
          docs: "Cancel a task. Once a task is cancelled, no further changes to the task can be made."
        },
        {
          name: 'Sign Cancel Task',
          type: "task",
          comment: '',
          docs: ""
        },
        {
          name: 'Set Task Skill',
          type: "task",
          comment: '',
          docs: "Set the skill of a task. Only one skill can be assigned per task. The user assigned the MANAGER task role and the user assigned the WORKER task role must both sign this transaction before it can be executed."
        },
        {
          name: 'Sign Set Task Skill',
          type: "task",
          comment: '',
          docs: ""
        },
        {
          name: 'Set Task Due Date',
          type: "task",
          comment: '',
          docs: "Set the due date of a task. The due date is the last day that the user assigned the WORKER task role can submit the task deliverable."
        },
        {
          name: 'Sign Set Task Due Date',
          type: "task",
          comment: '',
          docs: ""
        },
        {
          name: 'Get Task Role',
          type: "task",
          comment: 'GOOD. Returns object with address, rateFail, and rating',
          docs: ""
        },
        {
          name: 'Remove Task Evaluator Role',
          type: "task",
          comment: '',
          docs: "Remove the EVALUATOR task role assignment. This function can only be called before the task is complete, i.e. either before the deliverable has been submitted or the user assigned the WORKER task role has failed to meet the deadline and the user assigned the MANAGER task role has marked the task as complete."
        },
        {
          name: 'Sign Remove Task Evaluator Role',
          type: "task",
          comment: '',
          docs: ""
        },
        {
          name: 'Remove Task Worker Role',
          type: "task",
          comment: '',
          docs: "Remove the WORKER task role assignment. This function can only be called before the task is complete, i.e. either before the deliverable has been submitted or the user assigned the WORKER task role has failed to meet the deadline and the user assigned the MANAGER task role has marked the task as complete."
        },
        {
          name: 'Sign Remove Task Worker Role',
          type: "task",
          comment: '',
          docs: ""
        },
        {
          name: 'Set Task Evaluator Role',
          type: "task",
          comment: '',
          docs: "Assign the EVALUATOR task role to a user. This function can only be called before the task is finalized. The user assigned the  MANAGER task role and the user being assigned the EVALUATOR task role must both sign the transaction before it can be executed."
        },
        {
          name: 'Sign Set Task Evaluator Role',
          type: "task",
          comment: '',
          docs: ""
        },
        {
          name: 'Set Task Worker Role',
          type: "task",
          comment: '',
          docs: "Assign the WORKER task role to a user. This function can only be called before the task is finalized. The user assigned the  MANAGER task role and the user being assigned the WORKER task role must both sign the transaction before it can be executed."
        },
        {
          name: 'Sign Set Task Worker Role',
          type: "task",
          comment: '',
          docs: ""
        },
        {
          name: 'Get Task Payout',
          type: "task",
          comment: 'GOOD. Returns value in hex (BN)',
          docs: ""
        },
        {
          name: 'Set Task Manager Payout',
          type: "task",
          comment: '',
          docs: "Set the payout amount for the MANAGER task role."
        },
        {
          name: 'Sign Set Task Manager Payout',
          type: "task",
          comment: '',
          docs: ""
        },
        {
          name: 'Set Task Evaluator Payout',
          type: "task",
          comment: '',
          docs: "Set the payout amount for the EVALUATOR task role."
        },
        {
          name: 'Sign Set Task Evaluator Payout',
          type: "task",
          comment: '',
          docs: ""
        },
        {
          name: 'Set Task Worker Payout',
          type: "task",
          comment: '',
          docs: "Set the payout amount for the WORKER task role."
        },
        {
          name: 'Sign Set Task Worker Payout',
          type: "task",
          comment: '',
          docs: ""
        },
        {
          name: 'Set Task Brief',
          type: "task",
          comment: '',
          docs: "Set the task specification. The task specification, or 'task brief', is a description of the work that must be completed for the task. The description is hashed and stored with the task for future reference during the rating process or in the event of a dispute."
        },
        {
          name: 'Sign Set Task Brief',
          type: "task",
          comment: '',
          docs: ""
        },
        {
          name: 'Submit Task Deliverable',
          type: "task",
          comment: '',
          docs: "Submit the task deliverable. This function can only be called by the user assigned the WORKER task role on or before the task due date. The submission cannot be overwritten, which means the deliverable cannot be changed once it has been submitted."
        },
        {
          name: 'Submit Task Work Rating',
          type: "task",
          comment: '',
          docs: "Submit a work rating for a task. This function can only be called by the user assigned the EVALUATOR task role, who is submitting a rating for the user assigned the WORKER task role, or the user assigned the WORKER task role, who is submitting a rating for the user assigned the MANAGER task role. In order to submit a rating, a secret must be generated using the generateSecret method, which keeps the rating hidden until all ratings have been submitted and revealed."
        },
        {
          name: 'Reveal Task Work Rating',
          type: "task",
          comment: '',
          docs: "Reveal a submitted work rating. In order to reveal a work rating, the same salt and value used to generate the secret when the task work rating was submitted must be provided again here to reveal the task work rating."
        },
        {
          name: 'Finalize Task',
          type: "task",
          comment: '',
          docs: "Finalize a task. Once a task is finalized, each user assigned a task role can claim the payout assigned to their role and no further changes to the task can be made."
        }
    ];
  }
  
}
