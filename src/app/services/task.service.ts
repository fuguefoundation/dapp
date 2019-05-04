import { Injectable } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { TransactionService } from './transaction.service';
import { Multisig } from '../models/multisig';
import { UNSDG } from 'src/app/models/unsdg';

const ecp = require('../helpers/ecp');
// const executeTaskMultisig = require('../helpers/executeTaskMultisig');
const BN = require('bn.js');
const Web3 = require('web3');
declare let window: any;

@Injectable()
export class TaskService {

    multisig: Multisig[];

  constructor(private ds: DatabaseService, private tx: TransactionService) {
  }

  getMultisig() {
    console.log('taskService multisig');
    this.ds.getMultisig().subscribe((data: Multisig[]) => {
      this.multisig = data;
      console.log(this.multisig);
    });
  }

  getUNSDG() {
      return UNSDG;
  }

  // An example using the createColony method
  async createTask(colonyClient, domainId, specification) {

      // Initialise the Extended Colony Protocol
      await ecp.init();

      // Create a specification hash for the task
      const specificationHash = await ecp.saveHash(specification);

      // Stop the Extended Colony Protocol
      await ecp.stop();

      // Create a task and get the taskId from the event data
      // const { eventData: { taskId } } = await colonyClient.createTask.send({
      //     specificationHash,
      //     domainId,
      // });
      const meta = await colonyClient.createTask.send({
          specificationHash,
          domainId,
      });
      this.tx.updateTx(meta.meta.receipt, 'createTask');
      const taskId = meta.eventData.taskId;

      // Get our new task using the taskId
      const task = await colonyClient.getTask.call({ taskId });

      // Check out the logs to see our new task
      console.log('Task:', task);

      // Return our new task
      return task;

  }

  async cancelTask(colonyClient, taskId) {

      // Update the evaluator role of the task
      const operation = await colonyClient.cancelTask.startOperation({
        taskId
      });

      // Check out the logs to see the operation missing signees
      console.log('Missing Signees: cancelTask', operation.missingSignees);

      // Serialize the operation into JSON format
      const operationJSON = operation.toJSON();
      this.ds.postMultisig(operationJSON, 'cancelTask', taskId).subscribe(data => {
        console.log(data);
      });
      return operationJSON;
  }

  async signCancelTask(colonyClient, taskId) {

      // Execute task multisig operation for the given colonyJS method
      await this.ds.executeTaskMultisig(
        colonyClient,
        colonyClient.cancelTask,
        taskId
      );

      // Get the task evaluator role
      const task = await colonyClient.getTask.call({
        taskId
      });

      // Check out the logs to see the task evaluator role
      console.log('Cancel task: ', task);

      // Return the cancelled task
      return task;
  }

  async setTaskSkill(colonyClient, taskId, skillId) {

      // Start set task skill operation
      const operation = await colonyClient.setTaskSkill.startOperation({
        taskId,
        skillId,
      });

      // Check out the logs to see the operation missing signees
      console.log('Missing Signees:', operation.missingSignees);

      // Serialize the operation into JSON format
      const operationJSON = operation.toJSON();
      console.log(operationJSON);

      this.ds.postMultisig(operationJSON, 'setTaskSkill', taskId).subscribe(data => {
        console.log(data);
      }, err => {
        console.log(err);
      }, () => {

      });
  }

  async signSetTaskSkill(colonyClient, taskId) {

      await this.ds.executeTaskMultisig(
        colonyClient,
        colonyClient.setTaskSkill,
        taskId
      );

      // Get the updated task
      const updatedTask = await colonyClient.getTask.call({ taskId });

      // Check out the logs to see the task we updated
      console.log('Task:', updatedTask);

      // Return the updated task
      return updatedTask;

  }

  async setTaskDueDate(colonyClient, taskId, dueDate) {

      // Start the operation to set the dueDate for the given task
      const operation = await colonyClient.setTaskDueDate.startOperation({
        taskId,
        dueDate,
      });

      // Check out the logs to see the operation missing signees
      console.log('Missing Signees:', operation.missingSignees);

      // Serialize the operation into JSON format
      const operationJSON = operation.toJSON();

      this.ds.postMultisig(operationJSON, 'setTaskDueDate', taskId).subscribe(data => {
        console.log(data);
      });
      return operationJSON;

  }

  async signSetTaskDueDate(colonyClient, taskId) {

      await this.ds.executeTaskMultisig(
        colonyClient,
        colonyClient.setTaskDueDate,
        taskId
      );

      // Get the updated task
      const updatedTask = await colonyClient.getTask.call({ taskId });

      // Check out the logs to see the task we updated
      console.log('Task:', updatedTask);

      // Return the updated task
      return updatedTask;
  }

  async setTaskManagerPayout(colonyClient, taskId, amount, token) {

      // Start set task manager payout operation
      const operation = await colonyClient.setTaskManagerPayout.startOperation({
        taskId,
        token,
        amount: new BN(amount)
      });

      console.log(operation);

      // Check out the logs to see the operation missing signees
      console.log('Missing Signees:', operation.missingSignees);

      // Serialize operation into JSON format
      const operationJSON = operation.toJSON();
      console.log(operationJSON);
      this.ds.postMultisig(operationJSON, 'setTaskManagerPayout', taskId).subscribe(data => {
        console.log(data);
      });

      return operationJSON;
  }

  async signSetTaskManagerPayout(colonyClient, taskId) {

      await this.ds.executeTaskMultisig(
        colonyClient,
        colonyClient.setTaskManagerPayout,
        taskId
      );

      // Get the task manager payout
      const payout = await colonyClient.getTaskPayout.call({
        taskId,
        role: 'MANAGER',
        token: colonyClient.tokenClient._contract.address,
      });

      // Check out the logs to see the task manager payout
      console.log('Task Payout Amount:', payout.amount.toNumber());

      // Return the task manager payout
      return payout;
  }

  async setTaskEvaluatorPayout(colonyClient, taskId, amount, token) {

      // Start set task evaluator payout operation
      const operation = await colonyClient.setTaskEvaluatorPayout.startOperation({
        taskId,
        token,
        amount: new BN(amount),
      });

      // Check out the logs to see the operation missing signees
      console.log('Missing Signees:', operation.missingSignees);

      // Serialize operation into JSON format
      const operationJSON = operation.toJSON();
      this.ds.postMultisig(operationJSON, 'setTaskEvaluatorPayout', taskId).subscribe(data => {
        console.log(data);
      });
      return operationJSON;

  }

  async signSetTaskEvaluatorPayout(colonyClient, taskId) {

      // Execute task multisig operation for the given colonyJS method
      await this.ds.executeTaskMultisig(
        colonyClient,
        colonyClient.setTaskEvaluatorPayout,
        taskId
      );

      // Get the task evaluator payout
      const payout = await colonyClient.getTaskPayout.call({
        taskId,
        role: 'EVALUATOR',
        token: colonyClient.tokenClient._contract.address,
      });

      // Check out the logs to see the task evaluator payout
      console.log('Task Payout Amount:', payout.amount.toNumber());

      // Return the task evaluator payout
      return payout;
  }

  async setTaskWorkerPayout(colonyClient, taskId, amount, token) {
      console.log(token);

      // Start set task worker payout operation
      const operation = await colonyClient.setTaskWorkerPayout.startOperation({
        taskId,
        token,
        amount: new BN(amount),
      });

      // Check out the logs to see the operation missing signees
      console.log('Missing Signees:', operation.missingSignees);

      // Serialize operation into JSON format
      const operationJSON = operation.toJSON();
      this.ds.postMultisig(operationJSON, 'setTaskWorkerPayout', taskId).subscribe(data => {
        console.log(data);
      });
      return operationJSON;
  }

  async signSetTaskWorkerPayout (colonyClient, taskId) {

      // Execute task multisig operation for the given colonyJS method
      await this.ds.executeTaskMultisig(
        colonyClient,
        colonyClient.setTaskWorkerPayout,
        taskId
      );

      // Get the task worker payout
      const payout = await colonyClient.getTaskPayout.call({
        taskId,
        role: 'WORKER',
        token: colonyClient.tokenClient._contract.address,
      });

      // Check out the logs to see the task worker payout
      console.log('Task Payout Amount:', payout.amount.toNumber());

      // Return the task worker payout
      return payout;
  }

  async removeTaskEvaluatorRole(colonyClient, taskId, user) {

      // Update the evaluator role of the task
      const operation = await colonyClient.removeTaskEvaluatorRole.startOperation({
        taskId,
        user,
      });

      // Check out the logs to see the operation missing signees
      console.log('Missing Signees: removeTaskEvaluatorRole', operation.missingSignees);

      // Serialize the operation into JSON format
      const operationJSON = operation.toJSON();
      this.ds.postMultisig(operationJSON, 'removeTaskEvaluatorRole', taskId).subscribe(data => {
        console.log(data);
      });
      return operationJSON;
  }

  async signRemoveTaskEvaluatorRole(colonyClient, taskId) {

      // Execute task multisig operation for the given colonyJS method
      await this.ds.executeTaskMultisig(
        colonyClient,
        colonyClient.removeTaskEvaluatorRole,
        taskId
      );

      // Get the task evaluator role
      const taskRole = await colonyClient.getTaskRole.call({
        taskId,
        role: 'EVALUATOR',
      });

      // Check out the logs to see the task evaluator role
      console.log('Task Role: signRemoveTaskEvaluatorRole', taskRole);

      // Return the task evaluator role
      return taskRole;
  }

  async removeTaskWorkerRole(colonyClient, taskId) {

      // Update the Worker role of the task
      const operation = await colonyClient.removeTaskWorkerRole.startOperation({
        taskId
      });

      // Check out the logs to see the operation missing signees
      console.log('Missing Signees: removeTaskWorkerRole', operation.missingSignees);

      // Serialize the operation into JSON format
      const operationJSON = operation.toJSON();
      this.ds.postMultisig(operationJSON, 'removeTaskWorkerRole', taskId).subscribe(data => {
        console.log(data);
      });
      return operationJSON;
  }

  async signRemoveTaskWorkerRole(colonyClient, taskId) {

      // Execute task multisig operation for the given colonyJS method
      await this.ds.executeTaskMultisig(
        colonyClient,
        colonyClient.removeTaskWorkerRole,
        taskId
      );

      // Get the task Worker role
      const taskRole = await colonyClient.getTaskRole.call({
        taskId,
        role: 'WORKER'
      });

      // Check out the logs to see the task Worker role
      console.log('Task Role: signRemoveTaskWorkerRole', taskRole);

      // Return the task Worker role
      return taskRole;
  }

  async setTaskEvaluatorRole(colonyClient, taskId, user) {

      // Update the evaluator role of the task
      const operation = await colonyClient.setTaskEvaluatorRole.startOperation({
        taskId,
        user,
      });

      // Check out the logs to see the operation missing signees
      console.log('Missing Signees:', operation.missingSignees);

      // Serialize the operation into JSON format
      const operationJSON = operation.toJSON();
      this.ds.postMultisig(operationJSON, 'setTaskEvaluatorRole', taskId).subscribe(data => {
        console.log(data);
      });
      return operationJSON;
  }

  async signSetTaskEvaluatorRole(colonyClient, taskId) {

      await this.ds.executeTaskMultisig(
        colonyClient,
        colonyClient.setTaskEvaluatorRole,
        taskId
      );

      // Get the task evaluator role
      const taskRole = await colonyClient.getTaskRole.call({
        taskId,
        role: 'EVALUATOR',
      });

      // Check out the logs to see the task evaluator role
      console.log('Task Role: signSetTaskEvaluatorRole', taskRole);

      // Return the task evaluator role
      return taskRole;
  }

  async setTaskWorkerRole(colonyClient, taskId, user) {

      // Update the worker role of the task
      const operation = await colonyClient.setTaskWorkerRole.startOperation({
        taskId,
        user,
      });

      // Check out the logs to see the operation missing signees
      console.log('Missing Signees:', operation.missingSignees);

      // Serialize the operation into JSON format
      const operationJSON = operation.toJSON();
      console.log(operationJSON);

      this.ds.postMultisig(operationJSON, 'setTaskWorkerRole', taskId).subscribe(data => {
        console.log(data);
      });
      return operationJSON;
  }

  async signSetTaskWorkerRole(colonyClient, taskId) {

      await this.ds.executeTaskMultisig(
        colonyClient,
        colonyClient.setTaskWorkerRole,
        taskId
      );

      // Get the task worker role
      const taskRole = await colonyClient.getTaskRole.call({
        taskId,
        role: 'WORKER',
      });

      // Check out the logs to see the task worker role
      console.log('Task Role:', taskRole);

      // Return the task worker role
      return taskRole;
  }

  async setTaskBrief(colonyClient, taskId, specification) {

      // Initialise the Extended Colony Protocol
      await ecp.init();

      // Create a specification hash for the task
      const specificationHash = await ecp.saveHash(specification);

      // Check out the logs to see the specification hash
      console.log('Specification Hash: ' + specificationHash);

      // Stop the Extended Colony Protocol
      await ecp.stop();

      // Update the specification for the given task
      const operation = await colonyClient.setTaskBrief.startOperation({
        taskId,
        specificationHash,
      });

      // Check out the logs to see the operation missing signees
      console.log('Missing Signees:', operation.missingSignees);

      // Serialize the operation into JSON format
      const operationJSON = operation.toJSON();
      this.ds.postMultisig(operationJSON, 'setTaskBrief', taskId).subscribe(data => {
        console.log(data);
      });
      return operationJSON;
  }

  async signSetTaskBrief(colonyClient, taskId) {

      await this.ds.executeTaskMultisig(
        colonyClient,
        colonyClient.setTaskBrief,
        taskId
      );

      // Get the updated task
      const updatedTask = await colonyClient.getTask.call({ taskId });

      // Check out the logs to see the task we updated
      console.log('Task:', updatedTask);

      // Return the updated task
      return updatedTask;
  }

  async submitTaskDeliverable(colonyClient, taskId, deliverable) {

    // Initialise the Extended Colony Protocol
    await ecp.init();

    // Create a deliverable hash for the task
    const deliverableHash = await ecp.saveHash(deliverable);

    // Stop the Extended Colony Protocol
    await ecp.stop();

    // Submit the deliverable for the given task
    const {meta} = await colonyClient.submitTaskDeliverable.send({
      taskId,
      deliverableHash,
    });
    this.tx.updateTx(meta.receipt, 'submitTaskDeliverable');

    // Get the updated task
    const updatedTask = await colonyClient.getTask.call({ taskId });

    // Check out the logs to see the updated task
    console.log('Task:', updatedTask);

    // Return the updated task
    return updatedTask;
  }

  async submitTaskWorkRating(colonyClient, taskId, role, rating) {
      const web3 = new Web3(window.web3.currentProvider);
      // Set salt value
      const salt = web3.utils.sha3('secret');

      // Set rating value
      const value = rating;

      // Generate a secret for the work rating
      const { secret } = await colonyClient.generateSecret.call({
        salt,
        value,
      });

      // Submit task work rating for the given task and role
      const submitTaskWorkRating = await colonyClient.submitTaskWorkRating.send({
        taskId,
        role,
        secret,
      });
      console.log(submitTaskWorkRating);

      // Get the task work ratings
      const taskWorkRatings = await colonyClient.getTaskWorkRatings.call({
        taskId,
      });

      // Check out the logs to see the updated task work ratings
      console.log('Task Work Ratings:', taskWorkRatings);

      // Get the task role
      const taskRole = await colonyClient.getTaskRole.call({
        taskId,
        role,
      });

      // Check out the logs to see the task role
      console.log('Task Role:', taskRole);

      // Return the task work ratings
      return taskWorkRatings;
  }

  async revealTaskWorkRating(colonyClient, taskId, role, rating) {
      const web3 = new Web3(window.web3.currentProvider);
      // Set salt value
      const salt = web3.utils.sha3('secret');

      // Set rating value
      const value = rating;

      // Generate a secret for the task work rating
      const { secret } = await colonyClient.generateSecret.call({
        salt,
        value
      });

      // Reveal the task work rating
      const {meta} = await colonyClient.revealTaskWorkRating.send({
        taskId,
        role,
        rating,
        salt
      });
      console.log(meta);

      // Get the task work ratings
      const taskWorkRatings = await colonyClient.getTaskWorkRatings.call({
        taskId,
      });

      // Check out the logs to see the task work ratings
      console.log('Task Work Ratings:', taskWorkRatings);

      // Get the task role
      const taskRole = await colonyClient.getTaskRole.call({
        taskId,
        role,
      });

      // Check out the logs to see the task role
      console.log('Task Role:', taskRole);

      // Return the task role
      return taskRole;
  }

  async finalizeTask(colonyClient, taskId) {

      // Finalize the given task
      const {meta} = await colonyClient.finalizeTask.send({ taskId });
      console.log(meta);

      // Get the updated task
      const updatedTask = await colonyClient.getTask.call({ taskId });

      // Check out the logs to see the updated task
      console.log('Task:', updatedTask);

      // Return the updated task
      return updatedTask;
  }

  async getTaskRole(colonyClient, id, role) {
    // Get the task evaluator role
    const taskId = Number(id);
    const taskRole = await colonyClient.getTaskRole.call({
      taskId,
      role: role,
    });
    console.log(taskRole);
    return taskRole;
  }

  async getTaskPayout(colonyClient, id, role, token) {
    // Get the task evaluator role
    const taskId = Number(id);
    const payout = await colonyClient.getTaskPayout.call({
      taskId,
      role: role,
      token: token,
    });
    return payout;
  }

  async getTask(colonyClient, id) {
    return await colonyClient.getTask.call({
      taskId: id
    });
  }

    getMethods() {
        return [
          {
            name: 'Create Task',
            id: 'createTask',
            field: [
              {
                placeholder: 'Domain ID',
                validation: 'number',
                id: 'createTaskDomainID'
              },
              {
                placeholder: 'Task Title',
                validation: 'string',
                id: 'createTaskTitle'
              },
              {
                placeholder: 'Task Description',
                validation: 'string',
                id: 'createTaskDescription'
              }
            ],
            docs: "Create a new task within the colony."
          },
          {
            name: 'Get Task',
            id: 'getTask',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'getTaskID'
              }
            ],
            docs: "Retrieve details about an existing task"
          },
          {
            name: 'Get Task Role',
            id: 'getTaskRole',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'getTaskRoleTaskID'
              },
              {
                placeholder: 'Role',
                validation: 'role',
                id: 'getTaskRoleRole'
              }
            ],
            docs: "Find address and rating info associated with a role for a given task"
          },
          {
            name: 'Cancel Task',
            id: 'cancelTask',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'cancelTaskID'
              }
            ],
            docs: "Cancel a task. Once a task is cancelled, no further changes to the task can be made."
          },
          {
            name: 'Sign Cancel Task',
            id: 'signCancelTask',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'signCancelTaskID'
              }
            ],
            docs: ""
          },
          {
            name: 'Set Task Skill',
            id: 'setTaskSkill',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'setTaskSkillTaskID'
              },
              {
                placeholder: 'Skill ID',
                validation: 'number',
                id: 'setTaskSkillSkillID'
              }
            ],
            docs: "Set the skill of a task. Only one skill can be assigned per task. The user assigned the MANAGER task role and the user assigned the WORKER task role must both sign this transaction before it can be executed."
          },
          {
            name: 'Sign Set Task Skill',
            id: 'signSetTaskSkill',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'signSetTaskSkillTaskID'
              }
            ],
            docs: ""
          },
          {
            name: 'Set Task Due Date',
            id: 'setTaskDueDate',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'setTaskDueDateTaskID'
              },
              {
                placeholder: 'Due Date',
                validation: 'number',
                id: 'setTaskDueDateDate'
              }
            ],
            docs: "Set the due date of a task. The due date is the last day that the user assigned the WORKER task role can submit the task deliverable."
          },
          {
            name: 'Sign Set Task Due Date',
            id: 'signSetTaskDueDate',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'signSetTaskDueDateTaskID'
              }
            ],
            docs: ""
          },
          {
            name: 'Remove Task Evaluator Role',
            id: 'removeTaskEvaluatorRole',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'removeTaskEvaluatorRoleTaskID'
              },
              {
                placeholder: 'User Address',
                validation: 'address',
                id: 'removeTaskEvaluatorRoleAddress'
              }
            ],
            docs: "Remove the EVALUATOR task role assignment. This function can only be called before the task is complete, i.e. either before the deliverable has been submitted or the user assigned the WORKER task role has failed to meet the deadline and the user assigned the MANAGER task role has marked the task as complete."
          },
          {
            name: 'Sign Remove Task Evaluator Role',
            id: 'signRemoveTaskEvaluatorRole',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'signRemoveTaskEvaluatorRoleTaskID'
              }
            ],
            docs: ""
          },
          {
            name: 'Remove Task Worker Role',
            id: 'removeTaskWorkerRole',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'removeTaskWorkerRoleTaskID'
              }
            ],
            docs: "Remove the WORKER task role assignment. This function can only be called before the task is complete, i.e. either before the deliverable has been submitted or the user assigned the WORKER task role has failed to meet the deadline and the user assigned the MANAGER task role has marked the task as complete."
          },
          {
            name: 'Sign Remove Task Worker Role',
            id: 'signRemoveTaskWorkerRole',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'signRemoveTaskWorkerRoleTaskID'
              }
            ],
            docs: ""
          },
          {
            name: 'Set Task Evaluator Role',
            id: 'setTaskEvaluatorRole',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'setTaskEvaluatorRoleTaskID'
              },
              {
                placeholder: 'User Address',
                validation: 'address',
                id: 'setTaskEvaluatorRoleAddress'
              }
            ],
            docs: "Assign the EVALUATOR task role to a user. This function can only be called before the task is finalized. The user assigned the  MANAGER task role and the user being assigned the EVALUATOR task role must both sign the transaction before it can be executed."
          },
          {
            name: 'Sign Set Task Evaluator Role',
            id: 'signSetTaskEvaluatorRole',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'signSetTaskEvaluatorRoleTaskID'
              }
            ],
            docs: ""
          },
          {
            name: 'Set Task Worker Role',
            id: 'setTaskWorkerRole',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'setTaskWorkerRoleTaskID'
              },
              {
                placeholder: 'User Address',
                validation: 'address',
                id: 'setTaskWorkerRoleAddress'
              }
            ],
            docs: "Assign the WORKER task role to a user. This function can only be called before the task is finalized. The user assigned the  MANAGER task role and the user being assigned the WORKER task role must both sign the transaction before it can be executed."
          },
          {
            name: 'Sign Set Task Worker Role',
            id: 'signSetTaskWorkerRole',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'signSetTaskWorkerRoleTaskID'
              }
            ],
            docs: ""
          },
          {
            name: 'Get Task Payout',
            id: 'getTaskPayout',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'getTaskPayoutTaskID'
              },
              {
                placeholder: 'Role',
                validation: 'role',
                id: 'getTaskPayoutRole'
              },
              {
                placeholder: 'Token Address',
                validation: 'address',
                id: 'getTaskPayoutAddress'
              }
            ],
            docs: "Retrieve payout amount for the role of a given task"
          },
          {
            name: 'Set Task Manager Payout',
            id: 'setTaskManagerPayout',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'setTaskManagerPayoutTaskID'
              },
              {
                placeholder: 'Amount',
                validation: 'number',
                id: 'setTaskManagerPayoutAmount'
              },
              {
                placeholder: 'Token Address',
                validation: 'address',
                id: 'setTaskManagerPayoutAddress'
              }
            ],
            docs: "Set the payout amount for the MANAGER task role."
          },
          {
            name: 'Sign Set Task Manager Payout',
            id: 'signSetTaskManagerPayout',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'signSetTaskManagerPayoutTaskID'
              }
            ],
            docs: ""
          },
          {
            name: 'Set Task Evaluator Payout',
            id: 'setTaskEvaluatorPayout',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'setTaskEvaluatorPayoutTaskID'
              },
              {
                placeholder: 'Amount',
                validation: 'number',
                id: 'setTaskEvaluatorPayoutAmount'
              },
              {
                placeholder: 'Token Address',
                validation: 'address',
                id: 'setTaskEvaluatorPayoutAddress'
              }
            ],
            docs: "Set the payout amount for the EVALUATOR task role."
          },
          {
            name: 'Sign Set Task Evaluator Payout',
            id: 'signSetTaskEvaluatorPayout',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'signSetTaskEvaluatorPayoutTaskID'
              }
            ],
            docs: ""
          },
          {
            name: 'Set Task Worker Payout',
            id: 'setTaskWorkerPayout',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'setTaskWorkerPayoutTaskID'
              },
              {
                placeholder: 'Amount',
                validation: 'number',
                id: 'setTaskWorkerPayoutAmount'
              },
              {
                placeholder: 'Token Address',
                validation: 'address',
                id: 'setTaskWorkerPayoutAddress'
              }
            ],
            docs: "Set the payout amount for the WORKER task role."
          },
          {
            name: 'Sign Set Task Worker Payout',
            id: 'signSetTaskWorkerPayout',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'signSetTaskWorkerPayoutTaskID'
              }
            ],
            docs: ""
          },
          {
            name: 'Set Task Brief',
            id: 'setTaskBrief',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'setTaskBriefTaskID'
              },
              {
                placeholder: 'Title',
                validation: 'string',
                id: 'setTaskBriefTitle'
              },
              {
                placeholder: 'Description',
                validation: 'string',
                id: 'setTaskBriefDesc'
              }
            ],
            docs: "Set the task specification. The task specification, or 'task brief', is a description of the work that must be completed for the task. The description is hashed and stored with the task for future reference during the rating process or in the event of a dispute."
          },
          {
            name: 'Sign Set Task Brief',
            id: 'signSetTaskBrief',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'signSetTaskBriefTaskId'
              }
            ],
            docs: ""
          },
          {
            name: 'Submit Task Deliverable',
            id: 'submitTaskDeliverable',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'submitTaskDeliverableTaskID'
              },
              {
                placeholder: 'Message',
                validation: 'string',
                id: 'submitTaskDeliverableMessage'
              }
            ],
            docs: "Submit the task deliverable. This function can only be called by the user assigned the WORKER task role on or before the task due date. The submission cannot be overwritten, which means the deliverable cannot be changed once it has been submitted."
          },
          {
            name: 'Submit Task Work Rating',
            id: 'submitTaskWorkRating',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'submitTaskWorkRatingTaskID'
              },
              {
                placeholder: 'Role',
                validation: 'role',
                id: 'submitTaskWorkRatingRole'
              },
              {
                placeholder: 'Rating',
                validation: 'number',
                id: 'submitTaskWorkRatingRating'
              }
            ],
            docs: "Submit a work rating for a task. This function can only be called by the user assigned the EVALUATOR task role, who is submitting a rating for the user assigned the WORKER task role, or the user assigned the WORKER task role, who is submitting a rating for the user assigned the MANAGER task role. In order to submit a rating, a secret must be generated using the generateSecret method, which keeps the rating hidden until all ratings have been submitted and revealed."
          },
          {
            name: 'Reveal Task Work Rating',
            id: 'revealTaskWorkRating',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'revealTaskWorkRatingTaskID'
              },
              {
                placeholder: 'Role',
                validation: 'role',
                id: 'revealTaskWorkRatingRole'
              },
              {
                placeholder: 'Rating',
                validation: 'number',
                id: 'revealTaskWorkRatingRating'
              }
            ],
            docs: "Reveal a submitted work rating. In order to reveal a work rating, the same salt and value used to generate the secret when the task work rating was submitted must be provided again here to reveal the task work rating."
          },
          {
            name: 'Finalize Task',
            id: 'finalizeTask',
            field: [
              {
                placeholder: 'Task ID',
                validation: 'number',
                id: 'finalizeTaskTaskID'
              }
            ],
            docs: "Finalize a task. Once a task is finalized, each user assigned a task role can claim the payout assigned to their role and no further changes to the task can be made."
          }
        ]
    }
}
