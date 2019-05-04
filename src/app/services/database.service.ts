import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TransactionService } from './transaction.service';
import { Multisig } from '../models/multisig';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()
export class DatabaseService {

    BASE_URL = 'http://localhost:63145/api';
    uri = 'http://localhost:4000/api';

    constructor(private http: HttpClient, private tx: TransactionService, private sb: MatSnackBar) {}

    openSnackBar(message: string, action: string) {
        this.sb.open(message, action, {
            duration: 4000,
        });
    }    

    getMultisig() {
        return this.http.get(`${this.uri}/multisig`);
    }

    postMultisig(data, method, taskId): Observable<any> {
        console.log('ds post: ' + method);
        const payload = {data: data, method: method, taskId: taskId}
        //return this.http.post(`${this.uri}/multisig/add?method=${method}`, payload);
        return this.http.post(`${this.uri}/multisig/add`, payload);
    }

    patchMultisig(data, method, id): Observable<any> {
        console.log('ds patch: ' + method);
        console.log(data);
        //return this.http.post(`${this.uri}/multisig/update/${id}?method=${method}`, data);
        return this.http.patch(`${this.uri}/multisig/update/${id}`, data, httpOptions);
    }

    deleteMultisig(method, id): Observable<any> {
        console.log('ds patch: ' + method);
        console.log(id);
        return this.http.get(`${this.uri}/multisig/delete/${id}`);
    }

    async executeTaskMultisig(colonyClient, taskMethod, taskId) {

        this.getMultisig().subscribe(async (database: Array<Multisig>) => {
            console.log(database);
            console.log('ETMS: ' + taskMethod.name);

            // Get JSON formatted operation from the database
            // const operationJSON = JSON.stringify(database[taskMethod.name]);
            let operationJSON;
            let id;

            for (let i = 0; i < database.length; i++) {
              if(database[i].method == taskMethod.name && database[i].taskId == taskId) {
                operationJSON = database[i].data;
                id = database[i]._id;
              }
            }  

            console.log(operationJSON);
            console.log(id);    

            // Check the operation
            if (operationJSON) {

                // Restore operation
                const operation = await taskMethod.restoreOperation(
                    operationJSON
                );

                // Check if the operation matches the colony contract and task id and if
                // the current account is one of the required signees for the operation.
                if (
                    operation.payload.sourceAddress === colonyClient.contract.address &&
                    operation.payload.inputValues.taskId === taskId &&
                    //operation.missingSignees.includes(colonyClient.adapter.wallet.address.toLowerCase())
                    operation.missingSignees.includes(colonyClient.adapter.wallet.wallet.address.toLowerCase())
                ) {

                    console.log('await sign: ' + taskMethod.name);
                    // Sign the operation
                    await operation.sign();

                    // Check for missing signees
                    if (operation.missingSignees.length === 0) {

                        // Send the operation
                        const {meta} = await operation.send();
                        this.tx.updateTx(meta.receipt, taskMethod.name);

                        // Update the operation in the database to empty object
                        this.deleteMultisig(taskMethod.name, id).subscribe(data => {
                            console.log('patch subscribe finished');
                    });

                } else {

                    // Check out the logs to see the operation missing signees
                    console.log('ETMS Missing Signees:', operation.missingSignees);
                    this.openSnackBar('Missing signees: ' + operation.missingSignees[0], null);

                    // Serialize operation into JSON format
                    const _operationJSON = operation.toJSON();
                    //const _operationJSON = operation.payload;



                    // Store the operation in the mock database
                    this.postMultisig(_operationJSON, taskMethod.name, taskId).subscribe(data => {
                        console.log(data);
                        console.log('post subscribe finished');
                        if(data) {
                            this.deleteMultisig(taskMethod.name, id).subscribe(data => {
                                console.log('delete subscribe finished');
                            });
                        }
                    });

                    }

                } else {

                    // Check out the logs to see the source of the pending operation
                    console.log('Operation Source:', operation.payload.sourceAddress);

                    // Check out the logs to see the task id of the pending operation
                    console.log('Operation Task ID:', operation.payload.inputValues.taskId);

                    // Check out the logs to see the required signees of the operation
                    console.log('Missing Signees:', operation.missingSignees);
                    this.openSnackBar('Missing signee: ' + operation.missingSignees[0], null);
                }
            }
        }, err => {
            console.log(err);
        });
    }

    /** Deprecated ****************/

    getDatabase(): Observable<any> {
        return this.http.get(this.BASE_URL + '/database');
    }

    postDatabase(data, method): Observable<any> {
        console.log('ds post: ' + method);
        const url = `/database?method=${method}`;
        return this.http.post(this.BASE_URL + url, data, httpOptions);
    }

    patchDatabase(data, method): Observable<any> {
        console.log('ds patch: ' + method);
        const url = `/database?method=${method}`;
        return this.http.patch(this.BASE_URL + url, data, httpOptions);
    }

    // async executeTaskMultisig(colonyClient, taskMethod, taskId) {

    //     this.getDatabase().subscribe(async (database) => {
    //         console.log('ETMS: ' + taskMethod.name);

    //         // Get JSON formatted operation from the database
    //         const operationJSON = JSON.stringify(database[taskMethod.name]);

    //         // Check the operation
    //         if (operationJSON) {

    //         // Restore operation
    //         const operation = await taskMethod.restoreOperation(
    //             operationJSON
    //         );

    //         // Check if the operation matches the colony contract and task id and if
    //         // the current account is one of the required signees for the operation.
    //         if (
    //             operation.payload.sourceAddress === colonyClient.contract.address &&
    //             operation.payload.inputValues.taskId === taskId &&
    //             //operation.missingSignees.includes(colonyClient.adapter.wallet.address.toLowerCase())
    //             operation.missingSignees.includes(colonyClient.adapter.wallet.wallet.address.toLowerCase())
    //         ) {

    //             console.log('await sign: ' + taskMethod.name);
    //             // Sign the operation
    //             await operation.sign();

    //             // Check for missing signees
    //             if (operation.missingSignees.length === 0) {

    //             // Send the operation
    //             const {meta} = await operation.send();
    //             this.tx.updateTx(meta.receipt, taskMethod.name);

    //             // Update the operation in the database to empty object
    //             this.patchDatabase({}, taskMethod.name).subscribe(data => {
    //                 console.log('patch subscribe finished');
    //             });

    //             } else {

    //             // Check out the logs to see the operation missing signees
    //             console.log('ETMS Missing Signees:', operation.missingSignees);

    //             // Serialize operation into JSON format
    //             const _operationJSON = operation.toJSON();

    //             // Store the operation in the mock database
    //             this.postDatabase(_operationJSON, taskMethod.name).subscribe(data => {
    //                 console.log('post subscribe finished');
    //             });
    //             // this.database.operations[taskMethod.name] = _operationJSON;

    //             }

    //         } else {

    //             // Check out the logs to see the source of the pending operation
    //             console.log('Operation Source:', operation.payload.sourceAddress);

    //             // Check out the logs to see the task id of the pending operation
    //             console.log('Operation Task ID:', operation.payload.inputValues.taskId);

    //             // Check out the logs to see the required signees of the operation
    //             console.log('Missing Signees:', operation.missingSignees);
    //         }
    //         }
    //     }, err => {
    //         console.log(err);
    //     });
    // }
}
