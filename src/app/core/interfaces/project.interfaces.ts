export interface Project {
  id?: string | number;
  userId?: string;
  name: string;
  description: string;
  deadline: string | Date;
  status: string;
  priority: string;
}