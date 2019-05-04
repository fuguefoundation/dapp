import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NetworkClientService, StateService, PurserService, IPFSService } from '../../services/services';
import { MethodInstance } from '../../models/method';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html'
})
export class NetworkComponent implements OnInit {
  private state: Array<any> = [];
  private todos: Array<any>;
  public methods;
  public methodSelected: MethodInstance;
  public result : any;

  model = {
    networkAddr: '',
    networkProvider: '',
    networkSignerAddr: ''
  };

  networkForm = new FormGroup({
    0: new FormControl('', Validators.required),
    1: new FormControl('', Validators.required)
  });

  constructor(private ncs: NetworkClientService, private ss: StateService, 
    private ps: PurserService, private ipfs: IPFSService) { }

  ngOnInit() {
    this.state = this.ss.getState();
    this.todos = this.ss.getTodo();
    this.ss.stateObservable.subscribe((state) => {
      this.state = this.ss.getState();
    });
    // this.ss.stateObservableEval.subscribe((state) => {
    //   this.stateEval = this.ss.getStateEval();
    // });
    // this.ss.stateObservableWorker.subscribe((state) => {
    //   this.stateWorker = this.ss.getStateWorker();
    // });
    //this.connectNetwork();
    //this.ncs.blockNative();
    this.methods = this.ncs.getMethods();
  }

  userChoosesNetwork(choice) {
    this.connectNetworkRinkeby(choice);
  }

//   getAccounts() {
//     this.ss.getAccounts().then(res => {
//       this.accounts = res;
//     });
//   }

  connectNetwork() {
    this.ps.metamask();

    this.ncs.connectNetwork(0).then(res => {
      this.ss.updateState(res);
      this.model.networkAddr = res._contract.address;
      this.model.networkProvider = res._contract.provider.url;
      this.model.networkSignerAddr = res._contract.signer.address;
      // this.ipfs.init();
    });
  }

  connectNetworkRinkeby(choice) {
    this.ncs.connectNetworkRinkeby(choice).then(res => {
        this.ss.updateState(res);
        this.model.networkAddr = res._contract.address;
        this.model.networkProvider = res._contract.provider.name;
        this.model.networkSignerAddr = res._contract.signer.wallet.address;
    });
  }

  onMethodSelected(index) {
    this.methodSelected = this.methods[index];
    console.log(this.methodSelected);
  }

  getMetaColonyClient() {
    this.ncs.getMetaColonyClient(this.state[0]).then(res => {
      console.log(res);
    }).catch( err => {
      console.error(err);
    });
  }

  getMetaColonyAddress() {
    this.ncs.getMetaColonyAddress(this.state[0]).then(res => {
      this.result = res;
    }).catch( err => {
      console.error(err);
    });
  }

  isInRecoveryMode() {
    this.ncs.isInRecoveryMode(this.state[0]).then(res => {
        this.result = res;
    }).catch( err => {
      console.error(err);
    });
  }

  executeMethod(method) {
    console.log(method);
    switch (method) {
        case "getMetaColonyClient":
            this.getMetaColonyClient();
            break;
        case "getMetaColonyAddress":
            this.getMetaColonyAddress();
            break;
        case "isInRecoveryMode":
            this.isInRecoveryMode();
            break;
        default:
            break;
    }
    this.networkForm.reset();
  }
}
