import { Routes } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { ProgressionFormComponent } from './components/progression-form/progression-form.component';

export const routes: Routes = [
     { path: '', component: TodoListComponent },
     { path: 'todo/:id/progress', component: ProgressionFormComponent }
];