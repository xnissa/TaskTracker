import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { ProjectService } from '../../core/services/project';
import { Project } from '../../core/interfaces/project.interfaces';
import { StatusBadge } from '../../shared/status-badge/status-badge';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzDatePickerModule,
    NzPopconfirmModule,
    NzIconModule,
    NzSpaceModule,
    NzCardModule,
    NzStatisticModule,
    NzTagModule,
    StatusBadge
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {
  projectService = inject(ProjectService);
  private modal = inject(NzModalService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  searchTerm = signal('');
  statusFilter = signal('All');
  priorityFilter = signal('All')

  filteredProjects = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    const priority = this.priorityFilter();
    const allProjects = this.projectService.projects();
    
    return allProjects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term);
      const matchesStatus = status === 'All' || p.status === status;
      const matchesPriority = priority === 'All' || p.priority === priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  });

  ngOnInit(): void {
    this.projectService.loadProjects();
  }

  exportToPDF(): void {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(255, 77, 133); 
    doc.text('Task Tracker - Project Report', 14, 15);

    const tableData = this.filteredProjects().map(p => [
      p.name, 
      p.description, 
      new Date(p.deadline).toLocaleDateString(), 
      p.status, 
      p.priority
    ]);

    autoTable(doc, {
      head: [['Project Name', 'Description', 'Deadline', 'Status', 'Priority']],
      body: tableData,
      startY: 20,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        textColor: [51, 51, 51], 
        lineColor: [255, 204, 213], 
        lineWidth: 0.1,
      },

      headStyles: {
        fillColor: [255, 77, 133], 
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },

      bodyStyles: {
        halign: 'center'
      },
    
      alternateRowStyles: {
        fillColor: [255, 240, 243] 
      }
    });

    doc.save('project_report.pdf');
  }

  isOverdue(deadline: string | Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const d = new Date(deadline);
    return d < today;
  }

  isVisible = false;
  isEditMode = false;
  currentProject?: Project;
  projectForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    deadline: [null, [Validators.required]],
    status: ['Active', [Validators.required]],
    priority: ['Medium', [Validators.required]],
  });

  showModal(project?: Project): void {
    this.isEditMode = !!project;
    this.currentProject = project;
    this.isVisible = true;

    if (project) {
      this.projectForm.patchValue({
        ...project,
        deadline: new Date(project.deadline)
      });
    } else {
      this.projectForm.reset({
        status: 'Active',
        priority: 'Medium'
      });
    }
  }

  handleOk(): void {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      
      if (this.isEditMode && this.currentProject) {
        this.projectService.updateProject({
          ...formValue,
          id: this.currentProject.id,
          userId: this.currentProject.userId // Menține utilizatorul curent alocat
        });
      } else {
        this.projectService.addProject(formValue);
      }
      this.isVisible = false;
    } else {
      Object.values(this.projectForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  deleteProject(id: string | number | undefined): void {
    if (id !== undefined) {
      this.projectService.deleteProject(id);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  onStatusClick(status: string) {
    console.log('Badge clicked:', status);
  }

  sortName(a: Project, b: Project) { return a.name.localeCompare(b.name); }
  sortDeadline(a: Project, b: Project) { 
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime(); 
  }
  sortStatus(a: Project, b: Project) { 
    return a.status.localeCompare(b.status); 
  }
  sortPriority(a: Project, b: Project) {
    const priorityWeight: { [key: string]: number } = { 'Low': 1, 'Medium': 2, 'High': 3 };
    return priorityWeight[a.priority] - priorityWeight[b.priority];
  }
}
