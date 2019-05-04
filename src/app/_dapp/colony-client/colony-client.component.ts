import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ColonyClientService, StateService } from '../../services/services';
import { MethodInstance } from '../../models/method';

@Component({
  selector: 'app-colony-client',
  templateUrl: './colony-client.component.html'
})
export class ColonyClientComponent implements OnInit {
  private state: Array<any> = [];
//   private stateEval: Array<any> = [];
//   private stateWorker: Array<any> = [];
  public methods;
  public methodSelected: MethodInstance;
  public result : any;

  model = {
    colony: {
      id: null,
      address: ''
    },
    // colonyEvaluator: false,
    // colonyWorker: false,
    hasUserRole: null,
    setAdminRole: null,
    sendEther: null
  };
  colonyForm = new FormGroup({
    0: new FormControl('', Validators.required),
    1: new FormControl('', Validators.required)
  });

  constructor(private ccs: ColonyClientService, private ss: StateService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.state = this.ss.getState();

    this.ss.stateObservable.subscribe((state) => {
      this.state = this.ss.getState();
    });
    // this.ss.stateObservableEval.subscribe((state) => {
    //   this.stateEval = this.ss.getStateEval();
    // });
    // this.ss.stateObservableWorker.subscribe((state) => {
    //   this.stateWorker = this.ss.getStateWorker();
    // });
    this.methods = this.ccs.getMethods();
    console.log(this.methods);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }

  createColony(tokenAddress) {
    this.ccs.createColony(
      this.state[0],             // networkClient
      tokenAddress            
    ).then(res => {
      this.ss.updateState(res);
      this.model.colony.id = res.id;
      this.model.colony.address = res.address;
      //this.getColonyClient();
    }).catch( err => {
      console.error(err);
      if (err) this.openSnackBar(err.message, err.name);
    });
  }

  getColonyClient(colonyId) {
    this.ccs.getColonyClient(
      this.state[0],                    // networkClient
      Number(colonyId)
    ).then(res => {
      this.ss.updateState(res);
      this.ss.updateMaster(['colony', {address: res._contract.address}]);
      this.ss.updateMaster(['token', {address: res.tokenClient._contract.address}]);
    }).catch( err => {
      console.error(err);
      if (err) this.openSnackBar(err.message, err.name);
    });
  }

  getColonyClientByAddress(colonyAddress) {
    this.ccs.getColonyClientByAddress(
      this.state[0],                    // networkClient
      colonyAddress
    ).then(res => {
      this.ss.updateState(res);
      this.ss.updateMaster(['colony', {address: res._contract.address}]);
      this.ss.updateMaster(['token', {address: res.tokenClient._contract.address}]);
    }).catch( err => {
      console.error(err);
      if (err) this.openSnackBar(err.message, err.name);
    });
  }

  hasUserRole(user, role) {
    this.ccs.hasUserRole(
      this.state[1],                    // colonyClient
      user,
      role
    ).then(res => {
      this.result = res;
      this.model.hasUserRole = res.hasRole;
    }).catch( err => {
      console.error(err);
      if (err) this.openSnackBar(err.message, err.name);
    });
  }

  setAdminRole(user) {
    this.ccs.setAdminRole(
      this.state[1],                    // colonyClient
      user
    ).then(res => {
      this.model.setAdminRole = res;
      console.log(res);
    }).catch( err => {
      console.error(err);
      if (err) this.openSnackBar(err.message, err.name);
    });
  }

  getVersion() {
    this.ccs.getVersion(this.state[1]).then(res => {
        this.result = res;
    }).catch( err => {
      console.error(err);
      if (err) this.openSnackBar(err.message, err.name);
    });
  }

  isInRecoveryMode() {
    this.ccs.isInRecoveryMode(this.state[1]).then(res => {
        this.result = res;
    }).catch( err => {
      console.error(err);
      if (err) this.openSnackBar(err.message, err.name);
    });
  }

  onMethodSelected(index) {
    this.methodSelected = this.methods[index];
    console.log(this.methodSelected);
  }

  executeMethod(method) {
    console.log(method);
    switch (method) {
        case "createColony":
            this.createColony(this.colonyForm.get('0').value);
            break;
        case "getColonyClient":
            this.getColonyClient(this.colonyForm.get('0').value);
            break;
        case "getColonyClientByAddress":
            this.getColonyClientByAddress(this.colonyForm.get('0').value);
            break;
        case "getVersion":
            this.getVersion();
            break;
        case "hasUserRole":
            this.hasUserRole(this.colonyForm.get('0').value, this.colonyForm.get('1').value);
            break;
        case "setAdminRole":
            this.setAdminRole(this.colonyForm.get('0').value);
            break;
        case "isInRecoveryMode":
            this.isInRecoveryMode();
            break;
        default:
            break;
    }
    this.colonyForm.reset();
  }
}
