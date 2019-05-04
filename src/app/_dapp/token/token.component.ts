import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
import { TokenService, StateService } from '../../services/services';
import { MethodInstance } from '../../models/method';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html'
})
export class TokenComponent implements OnInit {
  private state: Array<any> = [];
//   private stateEval: Array<any> = [];
//   private stateWorker: Array<any> = [];
  public methods;
  public methodSelected: MethodInstance;
  public result: any;

  model = {
    tokenName: '',
    tokenSymbol: '',
    tokenDecimals: null,
    tokenMinted: 0,
    tokenAddress: '',
    tokenOwner: '',
    totalSupply: {},
    potBalance: {},
    toPotBalanceAfter: {},
    _toPotBalanceAfter: {},
    tokenAmount: null,
    tokenInfo: {}
  };

  tokenFormControl = new FormControl('', [
    Validators.required
  ]);
  tokenMintFormControl = new FormControl('', [
    Validators.required
  ]);
  matcher = new MyErrorStateMatcher();
  tokenForm = new FormGroup({
    0: new FormControl('', Validators.required),
    1: new FormControl('', Validators.required),
    2: new FormControl('', Validators.required),
    3: new FormControl('', Validators.required)
  });

  constructor(private tokenService: TokenService, private ss: StateService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.state = this.ss.getState();
    this.ss.stateObservable.subscribe((state) => {
      this.state = this.ss.getState();
    });
    this.methods = this.tokenService.getMethods();
    setTimeout(() => {
        this.tokenService.getTokenInfo(this.state[1].tokenClient).then(res => {
            console.log(res);
        });
    }, 500);
    console.log(this.methods);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }

  createToken(symbol) {
    this.tokenService.createToken(
      this.state[0],         // networkClient
      symbol
    ).then(res => {
      this.result = res;
      this.model.tokenAddress = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  setTokenOwner(colonyAddress) {
    this.tokenService.setTokenOwner(
      this.state[1],                   // colonyClient
      colonyAddress
    ).then(res => {
      this.result = res;
      this.model.tokenOwner = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  setName(name) {
    this.tokenService.setName(
      this.state[1],                   // colonyClient
      name
    ).then(res => {
      this.result = res;
      console.log(res);
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  mintTokens(amount) {
    this.model.tokenMinted = amount;
    this.tokenService.mintTokens(
      this.state[1],                     // colonyClient
      amount
    ).then(res => {
      this.model.totalSupply = res;
      this.result = res;
      this.updateTokenDetails();
      //this.claimColonyFunds();
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  claimColonyFunds(tokenAddress) {
    this.tokenService.claimColonyFunds(
      this.state[1],          // colonyClient
      tokenAddress
    ).then(res => {
      this.model.potBalance = res;
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  moveFundsBetweenPots(fromPot, toPot, amount, tokenAddress) {
    this.tokenService.moveFundsBetweenPots(
      this.state[1],          // colonyClient
      Number(fromPot),  
      Number(toPot),
      Number(amount),
      tokenAddress
    ).then(res => {
      this.model.toPotBalanceAfter = res;
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

//   // Move from Domain to Task
//   _moveFundsBetweenPots() {
//     this.tokenService.moveFundsBetweenPots(
//       this.state[3],          // colonyClient
//       this.state[4].potId,           // fromPot - Domain
//       this.state[6].potId,             // toPot - Task
//       30,                             // amount
//       this.state[1],             // token address
//     ).then(res => {
//       this.model._toPotBalanceAfter = res;
//     });
//   }

  // Claim the manager payout for the task
  claimPayout(taskId, role, token) {
    this.tokenService.claimPayout(
      this.state[1],          // colonyClient
      taskId,
      role,
      token
    ).then(res => {
      console.log(res);
      this.result = res;
      console.log('todo');
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  sendEther(to, amount) {
    this.tokenService.sendEther(
      this.state[1],                    // colonyClient
      to,
      amount
    ).then(res => {
        console.log(res);
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  updateTokenDetails() {
    this.tokenService.updateTokenDetails(this.state[1].tokenClient).then(res => {
      console.log(res);
    });
  }

  getBalanceOf(addr) {
    this.tokenService.getBalanceOf(this.state[1].tokenClient, addr).then(res => {
      console.log(res);
      this.result = res;
      this.model.tokenAmount = res.amount;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  getTokenInfo() {
    this.tokenService.getTokenInfo(this.state[1].tokenClient).then(res => {
      console.log(res);
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  getToken() {
    this.tokenService.getToken(this.state[1]).then(res => {
      console.log(res);
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  getTotalSupply() {
    this.tokenService.getTotalSupply(this.state[1].tokenClient).then(res => {
      console.log(res);
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  approve(addr, amount) {
    this.tokenService.approve(this.state[1].tokenClient, addr, amount).then(res => {
      console.log(res);
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  transfer(addr, amount) {
    this.tokenService.transfer(this.state[1].tokenClient, addr, amount).then(res => {
      console.log(res);
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  transferFrom(source, destination, amount) {
    this.tokenService.transferFrom(this.state[1].tokenClient, source, destination, amount).then(res => {
      console.log(res);
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  getFundingPotBalance(potId, address) {
    this.tokenService.getFundingPotBalance(this.state[1], potId, address).then(res => {
      this.result = res;
      console.log(res);
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  getNonRewardPotsTotal(address) {
    this.tokenService.getNonRewardPotsTotal(this.state[1], address).then(res => {
      this.result = res;
      console.log(res);
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  getAllowance(sourceAddr, userAddr) {
    this.tokenService.getAllowance(this.state[1].tokenClient, sourceAddr, userAddr).then(res => {
      console.log(res);
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  convertETHtoWei(amount) {
    this.result = this.tokenService.convertETHtoWei(amount);
  }

  convertWeiToETH(amount) {
    this.result = this.tokenService.convertWeiToETH(amount);
  }

  onMethodSelected(index) {
    this.methodSelected = this.methods[index];
    console.log(this.methodSelected);
  }

  executeMethod(method) {
    console.log(method);
    switch (method) {
        case "approve":
            this.approve(this.tokenForm.get('0').value, this.tokenForm.get('1').value);
            break;
        case "getBalanceOf":
            this.getBalanceOf(this.tokenForm.get('0').value);
            break;
        case "getToken":
            this.getToken();
            break;
        case "getTokenInfo":
            this.getTokenInfo();
            break;
        case "getTotalSupply":
            this.getTotalSupply();
            break;
        case "createToken":
            this.createToken(this.tokenForm.get('0').value);
            break;
        case "setTokenOwner":
            this.setTokenOwner(this.tokenForm.get('0').value);
            break;
        case "setName":
            this.setName(this.tokenForm.get('0').value);
            break;
        case "mintTokens":
            this.mintTokens(this.tokenForm.get('0').value);
            break;
        case "claimColonyFunds":
            this.claimColonyFunds(this.tokenForm.get('0').value);
            break;
        case "moveFundsBetweenPots":
            this.moveFundsBetweenPots(this.tokenForm.get('0').value, this.tokenForm.get('1').value, this.tokenForm.get('2').value, this.tokenForm.get('3').value);
            break;
        case "claimPayout":
            this.claimPayout(this.tokenForm.get('0').value, this.tokenForm.get('1').value, this.tokenForm.get('2').value);
            break;
        case "transfer":
            this.transfer(this.tokenForm.get('0').value, this.tokenForm.get('1').value);
            break;
        case "transferFrom":
            this.transferFrom(this.tokenForm.get('0').value, this.tokenForm.get('1').value, this.tokenForm.get('2').value);
            break;
        case "getFundingPotBalance":
            this.getFundingPotBalance(this.tokenForm.get('0').value, this.tokenForm.get('1').value);
            break; 
        case "getNonRewardPotsTotal":
            this.getNonRewardPotsTotal(this.tokenForm.get('0').value);
            break;
        case "getAllowance":
            this.getAllowance(this.tokenForm.get('0').value, this.tokenForm.get('1').value);
            break; 
        case "sendEther":
            this.sendEther(this.tokenForm.get('0').value, this.tokenForm.get('1').value);
            break;
        case "convertETHtoWei":
            this.convertETHtoWei(this.tokenForm.get('0').value);
            break;
        case "convertWeiToETH":
            this.convertWeiToETH(this.tokenForm.get('0').value);
            break;
        default:
            break;
    }
    this.tokenForm.reset();
  }

}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
