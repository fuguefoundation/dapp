import {Component, OnInit} from '@angular/core';
import {TransactionService} from '../../services/services';
import {Tx} from '../../models/tx';

// declare let require: any;

@Component({
  selector: 'app-tx',
  templateUrl: './transaction.component.html'
})
export class TransactionComponent implements OnInit {

  txs: Array<Tx[]> = [];
  txNames: Array<string[]> = [];

  constructor(private txService: TransactionService) {

  }

  ngOnInit(): void {
    this.watchTx();
  }

  watchTx() {
    this.txService.txObservable.subscribe((tx) => {
      this.txs.push(tx);
    });
    this.txService.txName.subscribe((name) => {
      this.txNames.push(name);
    });
  }
}
