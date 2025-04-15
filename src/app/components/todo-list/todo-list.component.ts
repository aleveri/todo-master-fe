import { Component, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoItemModel } from '../../models/todo-item.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProgressionFormComponent } from '../progression-form/progression-form.component';


@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    TodoFormComponent,
    MatExpansionModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
    ProgressionFormComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  private todoService = inject(TodoService);
  todos = this.todoService.todos;
  selectedTodo: TodoItemModel | null = null;
  showForm = false;
  showProgressForm = false;

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe();
  }

  selectTodo(todo: TodoItemModel): void {
    this.selectedTodo = todo;
    this.showForm = true;
  }

  regsiterProgress(todo: TodoItemModel): void {
    this.selectedTodo = todo;
    this.showProgressForm = true;
  }

  getTotalProgress(todo: TodoItemModel): number {
    if (!todo?.progressions || todo.progressions.length === 0)
      return 0;

    const total = todo.progressions.reduce((sum, progression) => {
      return sum + (progression.percent || 0);
    }, 0);

    return Math.min(total, 100);
  }
}