import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, NzTagModule],
  template: `
    <nz-tag 
      [nzColor]="getStatusColor()"
      (click)="onClick()"
      style="cursor: pointer;">
      {{ status }}
    </nz-tag>
  `
})
export class StatusBadge {
  @Input() status: string = 'Active';
  @Output() statusClick = new EventEmitter<string>();

  getStatusColor(): string {
    switch(this.status) {
      case 'Active': return 'green';
      case 'Completed': return 'blue';
      case 'On Hold': return 'orange';
      default: return 'red';
    }
  }

  onClick() {
    this.statusClick.emit(this.status);
  }
}