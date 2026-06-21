import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../interfaces/project.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private projectsSignal = signal<Project[]>([]);
  private apiUrl = 'http://localhost:3000/projects';

  projects = this.projectsSignal.asReadonly();

  activeProjectsCount = computed(() => {
    return this.projectsSignal().filter((p) => p.status === 'Active').length;
  });

  completedProjectsCount = computed(() => {
    return this.projectsSignal().filter((p) => p.status === 'Completed').length;
  });

  totalProjectsCount = computed(() => {
    return this.projectsSignal().length;
  });

  private getUserId(): string | null {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return null;
    return token.replace('local-token-', '');
  }

  loadProjects() {
    const userId = this.getUserId();
    if (userId) {
      this.http.get<Project[]>(`${this.apiUrl}?userId=${userId}`).subscribe({
        next: (data) => this.projectsSignal.set(data),
        error: (err) => console.error('Error fetching projects', err)
      });
    }
  }

  addProject(project: Omit<Project, 'id'>) {
    const userId = this.getUserId();
    if (!userId) return;

    const newProject = { ...project, userId };
    this.http.post<Project>(this.apiUrl, newProject).subscribe(savedProject => {
      this.projectsSignal.update((projects) => [...projects, savedProject]);
    });
  }

  updateProject(updatedProject: Project) {
    this.http.put<Project>(`${this.apiUrl}/${updatedProject.id}`, updatedProject).subscribe(savedProject => {
      this.projectsSignal.update((projects) =>
        projects.map((p) => (p.id === savedProject.id ? savedProject : p))
      );
    });
  }

  deleteProject(id: string | number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.projectsSignal.update((projects) => projects.filter((p) => p.id !== id));
    });
  }
}