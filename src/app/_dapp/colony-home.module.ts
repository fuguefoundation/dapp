import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatDialogModule, MatListModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { ColonyHomeComponent } from './colony-home.component';
import { TokenComponent } from './token/token.component';
import { NetworkComponent } from './network/network.component';
import { ColonyClientComponent } from './colony-client/colony-client.component';
import { DomainSkillsComponent } from './domain-skills/domain-skills.component';
import { TasksComponent } from './tasks/tasks.component';
import { TasksDialogComponent } from './tasks/tasks-dialog.component';
import { TransactionComponent } from './transaction/transaction.component';

import { NetworkClientService, TokenService, ColonyClientService, DomainsSkillsService, TaskService,
  DatabaseService, TransactionService, PurserService, IPFSService } from '../services/services';

const SERVICES = [
  NetworkClientService,
  TokenService,
  ColonyClientService,
  DomainsSkillsService,
  TaskService,
  DatabaseService,
  //StateService,
  TransactionService,
  PurserService,
  IPFSService
];

export const routes = [
  { path: '', component: ColonyHomeComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatSnackBarModule,
    MatDialogModule,
    MatListModule
  ],
  declarations: [
    ColonyHomeComponent,
    TokenComponent,
    NetworkComponent,
    ColonyClientComponent,
    DomainSkillsComponent,
    TasksComponent,
    TasksDialogComponent,
    TransactionComponent
  ],
  providers: [ 
    SERVICES 
  ],
  entryComponents: [TasksDialogComponent]
})
export class ColonyHomeModule { }
