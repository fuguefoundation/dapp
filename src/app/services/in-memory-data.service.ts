import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const DATABASE = {
        operations: {
          setTaskSkill: {},
          setTaskDueDate: {},
          setTaskManagerPayout: {},
          setTaskEvaluatorPayout: {},
          setTaskWorkerPayout: {},
          removeTaskEvaluatorRole: {},
          setTaskEvaluatorRole: {},
          setTaskWorkerRole: {},
          setTaskBrief: {}
        },
    };
    return DATABASE;
  }
}
