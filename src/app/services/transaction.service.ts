import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Tx} from '../models/tx';

@Injectable()
export class TransactionService {

  public txObservable = new Subject<Tx[]>();
  public txName = new Subject<string[]>();

  constructor() {

  }

  updateTx(tx, name) {
    this.txObservable.next(tx);
    this.txName.next(name);
  }
}
