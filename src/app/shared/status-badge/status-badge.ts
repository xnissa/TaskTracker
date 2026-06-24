import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TaskStatus, TaskPriority } from '../task-constants'; 

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, NzTagModule],
  template: `
    <nz-tag 
      [nzColor]="getBadgeColor()"
      (click)="onClick()"
      style="cursor: pointer;">
      {{ value }}
    </nz-tag>
  `
})
export class StatusBadge {
  @Input() value: string = TaskStatus.Active;
  @Input() type: 'status' | 'priority' = 'status';
  @Output() badgeClick = new EventEmitter<string>();

  getBadgeColor(): string {
    if (this.type === 'status') {
      switch(this.value) {
        case TaskStatus.Active: return 'green';
        case TaskStatus.Completed: return 'blue';
        case TaskStatus.OnHold: return 'orange';
        default: return 'red';
      }
    } else {
      switch(this.value) {
        case TaskPriority.High: return 'red';
        case TaskPriority.Medium: return 'blue';
        default: return 'default';
      }
    }
  }

  onClick() {
    this.badgeClick.emit(this.value);
  }
}