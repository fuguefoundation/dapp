import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TasksDialogComponent } from "./tasks-dialog.component";
import { TaskService, StateService } from '../../services/services';
import { MethodInstance } from '../../models/method';
import { UNSDG } from '../../models/unsdg-class';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
  private state: Array<any> = [];
  private goals: Array<UNSDG>;
  public goal: UNSDG;
  public methods: Array<MethodInstance>;
  public methodSelected: MethodInstance;
  public result : any;

  //futureDueDate = new Date(Date.now() + 2678400000);
  accounts = [];

  model = {
      taskTitle: '',
      taskDesc: '',
      task: {
        completionDate: null,
        deliverableHash: null,
        domainId: null,
        dueDate: null,
        id: null,
        payoutsWeCannotMake: null,
        potId: null,
        specificationHash: '',
        status: ''
      },
      taskRole: {
        manager: {
            address: null,
            rateFail: false,
            rating: null
        },
        evaluator: {
            address: null,
            rateFail: false,
            rating: null
        },
        worker: {
            address: null,
            rateFail: false,
            rating: null
        }          
      },
      taskSign: {
        signSetTaskSkill: false,
        signSetTaskDueDate: false,
        signRemoveTaskEvaluatorRole: false,
        signSetTaskEvaluatorRole: false,
        _signSetTaskEvaluatorRole: false,
        signSetTaskWorkerRole: false,
        _signSetTaskWorkerRole: false,
        signSetTaskBrief: false,
        _signSetTaskBrief: false
      },
      taskPayout: {
        manager: null,
        evaluator: null,
        worker: null
      },
      taskSubmit: {
        submitTaskDeliverable: null,
        finalizeTask: null,
        submitTaskWorkRatingWorker: null,
        submitTaskWorkRatingManager: null,
        revealTaskWorkRatingWorker: null,
        revealTaskWorkRatingManager: null
      }
  };

  taskForm = new FormGroup({
    0: new FormControl('', Validators.required),
    1: new FormControl('', Validators.required),
    2: new FormControl('', Validators.required)
  });

  taskFormControl = new FormControl('', [
    Validators.required,
    // Validators.minLength(42),
    // Validators.maxLength(42)
  ]);
  matcher = new MyErrorStateMatcher();

  constructor(private ts: TaskService, private ss: StateService, 
    public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.state = this.ss.getState();
    this.ss.stateObservable.subscribe((state) => {
      this.state = this.ss.getState();
    });
    this.goals = this.ts.getUNSDG();
    this.goal = this.goals[1];
    console.log(this.goals);
    this.methods = this.ts.getMethods();
    this.ts.getMultisig();
    console.log(this.methods);
    setTimeout(() => {
        this.openDialog();
    }, 600);
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(TasksDialogComponent, {
      width: '400px'
      //data: { taskId: this.getTaskIdDialog }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result !== undefined) {
        this.getTask(result);
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }

  createTask(domainId, title, desc) {
    this.addCreateTaskEventListener();

    this.model.taskTitle = title;
    this.model.taskDesc = desc;
    this.ts.createTask(
      this.state[1],          // colonyClient
      Number(domainId),
      {
        title: title,
        description: desc
      }
    ).then(res => {
      //this.ss.updateState(res);
      this.model.task = res;
      this.result = res;
    //   this.ss.getAccounts().then(accs => {
    //     this.accounts = accs;
    //   });
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  cancelTask(taskId) {
    this.ts.cancelTask(
      this.state[1],          // colonyClient
      Number(taskId)
    ).then( (res) => {
        console.log(res);
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  signcancelTask(taskId) {
    this.ts.signCancelTask(
      this.state[1],          // colonyClient
      Number(taskId)
    ).then(res => {
      console.log(res);
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  setTaskSkill(taskId, skillId) {
    this.ts.setTaskSkill(
      this.state[1],          // colonyClient
      Number(taskId),
      Number(skillId)
    ).then( res => {
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  signSetTaskSkill(taskId) {
    this.ts.signSetTaskSkill(
      this.state[1],          // colonyClient
      Number(taskId)
    ).then(res => {
      if (res) {this.model.taskSign.signSetTaskSkill = true; }
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  setTaskDueDate(taskId, date) {
    this.ts.setTaskDueDate(
      this.state[1],          // colonyClient
      Number(taskId),
      date,                  // dueDate
    ).then(res => {
        console.log(res);
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  signSetTaskDueDate(taskId) {
    this.ts.signSetTaskDueDate(
        this.state[1],          // colonyClient
        Number(taskId)
    ).then(res => {
      if (res) {this.model.taskSign.signSetTaskDueDate = true; }
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  /************ SET/SIGN/REMOVE ROLES *************/

  removeTaskEvaluatorRole(taskId, userAddr) {
    this.ts.removeTaskEvaluatorRole(
        this.state[1],          // colonyClient
        Number(taskId),
        userAddr
    ).then(res => {
        console.log(res);
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  signRemoveTaskEvaluatorRole(taskId) {
    this.ts.signRemoveTaskEvaluatorRole(
        this.state[1],          // colonyClient
        Number(taskId)
    ).then(res => {
        if (res) {this.model.taskSign.signRemoveTaskEvaluatorRole = true; }
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  removeTaskWorkerRole(taskId, userAddr) {
    this.ts.removeTaskWorkerRole(
        this.state[1],          // colonyClient
        Number(taskId)
    ).then(res => {
        console.log(res);
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  signRemoveTaskWorkerRole(taskId) {
    this.ts.signRemoveTaskWorkerRole(
        this.state[1],          // colonyClient
        Number(taskId)
    ).then(res => {
        console.log(res);
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  setTaskEvaluatorRole(taskId, userAddr) {
    this.ts.setTaskEvaluatorRole(
        this.state[1],          // colonyClient
        Number(taskId),
        userAddr
    ).then(res => {
        console.log(res);
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  signSetTaskEvaluatorRole(taskId) {
    this.ts.signSetTaskEvaluatorRole(
        this.state[1],          // colonyClient
        Number(taskId)
    ).then(res => {
        if (res) {this.model.taskSign.signSetTaskEvaluatorRole = true; }
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  setTaskWorkerRole(taskId, userAddr) {
    this.ts.setTaskWorkerRole(
        this.state[1],          // colonyClient
        Number(taskId),
        userAddr
    ).then(res => {
        console.log(res);
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  signSetTaskWorkerRole(taskId) {
    this.ts.signSetTaskWorkerRole(
        this.state[1],          // colonyClient
        Number(taskId)
    ).then(res => {
        if (res) {this.model.taskSign.signSetTaskWorkerRole = true; }
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  /************ PAYOUTS *************/

  // Set the amount of tokens we want to payout the manager of our task
  setTaskManagerPayout(taskId, amount, tokenAddr) {
    this.ts.setTaskManagerPayout(
      this.state[1],          // colonyClient
      Number(taskId),
      Number(amount),
      tokenAddr
    ).then(res => {
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  // Sign the multisig operation associated with our changes to the manager payout
  // The requested changes were made before we assigned a manager to our task, so the changes will
  // only need to be approved by the current manager of the task.
  signSetTaskManagerPayout(taskId) {
    this.ts.signSetTaskManagerPayout(
      this.state[1],          // colonyClient
      Number(taskId)
    ).then(res => {
      console.log(res);
      this.result = res;
      this.model.taskPayout.manager = res.amount;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  // Set the amount of tokens we want to payout the evaluator of our task.
  // This starts a multisig operation and then stores the operation in our database.
  // The operation will need to be signed by all "requiredSignees" before the
  // changes to the payout will take affect.
  setTaskEvaluatorPayout(taskId, amount, tokenAddr) {
    this.ts.setTaskEvaluatorPayout(
      this.state[1],          // colonyClient
      Number(taskId),
      Number(amount),
      tokenAddr
    ).then(res => {
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  signSetTaskEvaluatorPayout(taskId) {
    this.ts.signSetTaskEvaluatorPayout(
      this.state[1],          // colonyClient
      Number(taskId)
    ).then(res => {
      console.log(res);
      this.model.taskPayout.evaluator = res.amount;
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  // Set the amount of tokens we want to payout the worker of our task.
  // This starts a multisig operation and then stores the operation in our database.
  // The operation will need to be signed by all "requiredSignees" before the
  // changes to the payout will take affect.
  setTaskWorkerPayout(taskId, amount, tokenAddr) {
    this.ts.setTaskWorkerPayout(
      this.state[1],          // colonyClient
      Number(taskId),
      Number(amount),
      tokenAddr
    ).then(res => {
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  signSetTaskWorkerPayout(taskId) {
    this.ts.signSetTaskWorkerPayout(
      this.state[1],          // colonyClient
      Number(taskId)
    ).then(res => {
      console.log(res);
      this.model.taskPayout.worker = res.amount;
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  setTaskBrief(taskId, title, desc) {
    this.ts.setTaskBrief(
      this.state[1],          // colonyClient
      Number(taskId),
      {
        title: title,
        description: desc,
      },
    ).then(res => {
        console.log(res);
        this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  // Sign with Worker colonyClient
  signSetTaskBrief(taskId) {
    this.ts.signSetTaskBrief(
      this.state[1],          // colonyClient
      Number(taskId)
    ).then(res => {
      this.model.taskSign.signSetTaskBrief = res;
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  /****** SUBMIT TASK DELIVERABLES AND RATINGS ********/

  // Submitted by worker only
  submitTaskDeliverable(taskId, message) {
    this.ts.submitTaskDeliverable(
      this.state[1],          // colonyClient Worker
      Number(taskId),
      {
        message: message
      }
    ).then(res => {
        this.result = res;
      this.model.taskSubmit.submitTaskDeliverable = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  // Submit a rating for the worker of our task from the evaluator of our task
  submitTaskWorkRating(taskId, role, rating) {
    this.ts.submitTaskWorkRating(
      this.state[1],          // colonyClient Evaluator
      Number(taskId),
      role,                       // WORKER
      Number(rating)
    ).then(res => {
      this.model.taskSubmit.submitTaskWorkRatingWorker = res;
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  // Reaveal the rating for the worker of our task from the evaluator of our task
  revealTaskWorkRating(taskId, role, rating) {
    this.ts.revealTaskWorkRating(
      this.state[1],          // colonyClient Evaluator
      Number(taskId),
      role,
      Number(rating)
    ).then(res => {
      this.model.taskSubmit.revealTaskWorkRatingWorker = res;
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  // Reaveal the rating for the manager of our task from the worker of our task
//   _revealTaskWorkRating() {
//     this.ts.revealTaskWorkRating(
//       this.stateWorker[1],          // colonyClient
//       this.state[6].id,                  // taskId
//       'MANAGER',                       // role
//       3                              // rating
//     ).then(res => {
//       this.model.taskSubmit.revealTaskWorkRatingManager = res;
//     });
//   }

  /********** FINALIZE TASK ************/

  finalizeTask(taskId) {
    this.ts.finalizeTask(
      this.state[1],          // colonyClient
      Number(taskId)
    ).then(res => {
        this.result = res;
      this.model.taskSubmit.finalizeTask = res;
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  /****** GETTER FUNCTIONS ********/
  async _getTaskRole(id, role) {
    return await this.ts.getTaskRole(this.state[1], id, role);
  }

  async getTaskRole(id, role) {
    await this.ts.getTaskRole(this.state[1], id, role).then(res => {
      console.log(res);
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  getTaskPayout(id, role, token) {
    this.ts.getTaskPayout(this.state[1], id, role, token).then(res => {
      console.log(res);
      this.result = res;
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  getTask(id) {
    this.ts.getTask(this.state[1], Number(id)).then(res => {
      console.log(res);
      this.model.task = res;
      this.goal = this.goals[res.domainId - 1];
      this._getTaskRole(res.id, "MANAGER").then(res => {
        this.model.taskRole.manager.address = res.address;
      });
      this._getTaskRole(res.id, "EVALUATOR").then(res => {
        this.model.taskRole.evaluator.address = res.address;
      });
      this._getTaskRole(res.id, "WORKER").then(res => {
        this.model.taskRole.worker.address = res.address;
      });
      //this.ss.updateMaster(['task', res]);
      this.result = '';
    }).catch( err => {
      if (err) this.openSnackBar(err.message, err.name);
      console.error(err);
    });
  }

  addCreateTaskEventListener() {
    const handler = ({ taskId }) => { console.log(`TaskAdded event: ${taskId}`); };
    this.state[1].events.TaskAdded.addListener(handler);
  }

  onMethodSelected(index) {
    this.methodSelected = this.methods[index];
    console.log(this.methodSelected);
  }

  executeMethod(method) {
    switch (method) {
        case "createTask":
            this.createTask(this.taskForm.get('0').value, this.taskForm.get('1').value, this.taskForm.get('2').value);
            break;
        case "getTask":
            this.getTask(this.taskForm.get('0').value);
            break;
        case "setTaskSkill":
            this.setTaskSkill(this.taskForm.get('0').value, this.taskForm.get('1').value);
            break;
        case "signSetTaskSkill":
            this.signSetTaskSkill(this.taskForm.get('0').value);
            break;
        case "setTaskDueDate":
            this.setTaskDueDate(this.taskForm.get('0').value, this.taskForm.get('1').value);
            break;
        case "signSetTaskDueDate":
            this.signSetTaskDueDate(this.taskForm.get('0').value);
            break;
        case "getTaskRole":
            this.getTaskRole(this.taskForm.get('0').value, this.taskForm.get('1').value);
            break;
        case "removeTaskEvaluatorRole":
            this.removeTaskEvaluatorRole(this.taskForm.get('0').value, this.taskForm.get('1').value);
            break;
        case "signRemoveTaskEvaluatorRole":
            this.signRemoveTaskEvaluatorRole(this.taskForm.get('0').value);
            break;
        case "setTaskEvaluatorRole":
            this.setTaskEvaluatorRole(this.taskForm.get('0').value, this.taskForm.get('1').value);
            break;
        case "signSetTaskEvaluatorRole":
            this.signSetTaskEvaluatorRole(this.taskForm.get('0').value);
            break;
        case "setTaskWorkerRole":
            this.setTaskWorkerRole(this.taskForm.get('0').value, this.taskForm.get('1').value);
            break;
        case "signSetTaskWorkerRole":
            this.signSetTaskWorkerRole(this.taskForm.get('0').value);
            break;
        case "getTaskPayout":
            this.getTaskPayout(this.taskForm.get('0').value, this.taskForm.get('1').value, this.taskForm.get('2').value);
            break;
        case "setTaskManagerPayout":
            this.setTaskManagerPayout(this.taskForm.get('0').value, this.taskForm.get('1').value, this.taskForm.get('2').value);
            break;
        case "signSetTaskManagerPayout":
            this.signSetTaskManagerPayout(this.taskForm.get('0').value);
            break;
        case "setTaskEvaluatorPayout":
            this.setTaskEvaluatorPayout(this.taskForm.get('0').value, this.taskForm.get('1').value, this.taskForm.get('2').value);
            break;
        case "signSetTaskEvaluatorPayout":
            this.signSetTaskEvaluatorPayout(this.taskForm.get('0').value);
            break;
        case "setTaskWorkerPayout":
            this.setTaskWorkerPayout(this.taskForm.get('0').value, this.taskForm.get('1').value, this.taskForm.get('2').value);
            break;
        case "signSetTaskWorkerPayout":
            this.signSetTaskWorkerPayout(this.taskForm.get('0').value);
            break;
        case "setTaskBrief":
            this.setTaskBrief(this.taskForm.get('0').value, this.taskForm.get('1').value, this.taskForm.get('2').value);
            break;
        case "signSetTaskBrief":
            this.signSetTaskBrief(this.taskForm.get('0').value);
            break;
        case "submitTaskDeliverable":
            this.submitTaskDeliverable(this.taskForm.get('0').value, this.taskForm.get('1').value);
            break;
        case "submitTaskWorkRating":
            this.submitTaskWorkRating(this.taskForm.get('0').value, this.taskForm.get('1').value, this.taskForm.get('2').value);
            break;
        case "revealTaskWorkRating":
            this.revealTaskWorkRating(this.taskForm.get('0').value, this.taskForm.get('1').value, this.taskForm.get('2').value);
            break;
        case "finalizeTask":
            this.finalizeTask(this.taskForm.get('0').value);
            break;
        default:
            break;
    }
    this.taskForm.reset();
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
