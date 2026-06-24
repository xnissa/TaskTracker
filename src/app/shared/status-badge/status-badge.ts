import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';

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
  @Input() value: string = 'Active';
  @Input() type: 'status' | 'priority' = 'status';
  @Output() badgeClick = new EventEmitter<string>();

  getBadgeColor(): string {
    if (this.type === 'status') {
      switch(this.value) {
        case 'Active': return 'green';
        case 'Completed': return 'blue';
        case 'On Hold': return 'orange';
        default: return 'red';
      }
    } else {
      switch(this.value) {
        case 'High': return 'red';
        case 'Medium': return 'yellow';
        default: return 'default';
      }
    }
  }

  onClick() {
    this.badgeClick.emit(this.value);
  }
}