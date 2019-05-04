import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'tasks-dialog.component',
  template: `
<mat-card>
    <mat-card-header>                
        <mat-card-title>Get Task</mat-card-title>
        <mat-card-subtitle>Which task are you working on?</mat-card-subtitle>
    </mat-card-header>
    <mat-card-content>
        <form>
            <mat-form-field>
                <input matInput placeholder="Task ID" name="getTaskDialog" [(ngModel)]="taskId">                       
            </mat-form-field>
            <div mat-dialog-actions>
                <button mat-button [mat-dialog-close]="taskId">Select</button>
                <button mat-button (click)="onNoClick()">Don't Know</button>
            </div>
        </form>                              
    </mat-card-content>
</mat-card>
  `,
})
export class TasksDialogComponent {

    taskId: any;

  constructor(
    public dialogRef: MatDialogRef<TasksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}