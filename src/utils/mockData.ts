export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated';

export interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  joinDate: string;
  salary: number;
  status: EmployeeStatus;
}

export const mockEmployees: Employee[] = [
  { id: 'EMP-001', name: 'Alice Johnson', department: 'Engineering', role: 'Frontend Developer', joinDate: '2023-01-15', salary: 85000, status: 'Active' },
  { id: 'EMP-002', name: 'Bob Smith', department: 'Marketing', role: 'Marketing Manager', joinDate: '2022-05-10', salary: 92000, status: 'Active' },
  { id: 'EMP-003', name: 'Charlie Brown', department: 'Sales', role: 'Account Executive', joinDate: '2021-11-20', salary: 75000, status: 'On Leave' },
  { id: 'EMP-004', name: 'Diana Ross', department: 'HR', role: 'HR Specialist', joinDate: '2024-02-01', salary: 68000, status: 'Active' },
  { id: 'EMP-005', name: 'Evan Davis', department: 'Engineering', role: 'Backend Developer', joinDate: '2023-08-14', salary: 90000, status: 'Terminated' },
  { id: 'EMP-006', name: 'Fiona Gallagher', department: 'Design', role: 'UI/UX Designer', joinDate: '2022-09-01', salary: 82000, status: 'Active' },
  { id: 'EMP-007', name: 'George Clooney', department: 'Executive', role: 'CEO', joinDate: '2015-01-01', salary: 250000, status: 'Active' },
  { id: 'EMP-008', name: 'Hannah Montana', department: 'Marketing', role: 'Content Creator', joinDate: '2023-11-15', salary: 65000, status: 'Active' },
  { id: 'EMP-009', name: 'Ian Somerhalder', department: 'Sales', role: 'Sales Director', joinDate: '2019-04-12', salary: 135000, status: 'Active' },
  { id: 'EMP-010', name: 'Julia Roberts', department: 'Engineering', role: 'DevOps Engineer', joinDate: '2021-07-22', salary: 98000, status: 'Active' },
  { id: 'EMP-011', name: 'Kevin Hart', department: 'Support', role: 'Customer Success', joinDate: '2023-03-10', salary: 55000, status: 'Active' },
  { id: 'EMP-012', name: 'Liam Neeson', department: 'Security', role: 'Security Chief', joinDate: '2018-10-30', salary: 110000, status: 'Active' },
  { id: 'EMP-013', name: 'Mia Thermopolis', department: 'Executive', role: 'COO', joinDate: '2017-06-15', salary: 195000, status: 'Active' },
  { id: 'EMP-014', name: 'Noah Centineo', department: 'Engineering', role: 'QA Engineer', joinDate: '2024-01-05', salary: 72000, status: 'Active' },
  { id: 'EMP-015', name: 'Olivia Pope', department: 'Legal', role: 'Legal Counsel', joinDate: '2020-12-01', salary: 145000, status: 'On Leave' },
  { id: 'EMP-016', name: 'Paul Rudd', department: 'HR', role: 'Recruiter', joinDate: '2022-08-18', salary: 62000, status: 'Active' },
  { id: 'EMP-017', name: 'Quinn Fabray', department: 'Design', role: 'Product Designer', joinDate: '2023-05-25', salary: 88000, status: 'Active' },
  { id: 'EMP-018', name: 'Ryan Reynolds', department: 'Marketing', role: 'Social Media Manager', joinDate: '2021-02-14', salary: 78000, status: 'Active' },
  { id: 'EMP-019', name: 'Scarlett Johansson', department: 'Engineering', role: 'Engineering Manager', joinDate: '2019-09-09', salary: 160000, status: 'Active' },
  { id: 'EMP-020', name: 'Tom Hanks', department: 'Sales', role: 'Account Executive', joinDate: '2020-05-05', salary: 77000, status: 'Active' },
  { id: 'EMP-021', name: 'Uma Thurman', department: 'Support', role: 'Technical Support', joinDate: '2023-10-10', salary: 58000, status: 'Active' },
  { id: 'EMP-022', name: 'Vin Diesel', department: 'Engineering', role: 'Full Stack Developer', joinDate: '2022-11-11', salary: 95000, status: 'Terminated' },
];
