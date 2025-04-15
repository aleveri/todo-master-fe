import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { CommonModule } from '@angular/common';
import { TodoItemModel } from '../../models/todo-item.model';
import { UpdateTodoRequest } from '../../models/update-todo-request.model';
import { CreateTodoRequest } from '../../models/create-todo-request.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent {
  @Input() todo: TodoItemModel | null = null;
  @Output() close = new EventEmitter<void>();

  public categories: string[] = ["Work", "Personal", "Urgent"];

  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);
  todoForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    category: ['']
  });

  ngOnInit(): void {
    if (this.todo) {
      this.todoForm.patchValue({
        title: this.todo.title,
        description: this.todo.description,
        category: this.todo.category
      });
    }
  }

  onSubmit(): void {
    if (this.todoForm.invalid) return;

    const formValue = this.todoForm.value;

    if (this.todo) {
      const request: UpdateTodoRequest = {
        description: formValue.description || ''
      };

      this.todoService.updateTodo(this.todo.id, request).subscribe(() => {
        this.close.emit();
      });
    } else {
      const request: CreateTodoRequest = {
        title: formValue.title || '',
        description: formValue.description || '',
        category: formValue.category || ''
      };

      this.todoService.createTodo(request).subscribe(() => {
        this.close.emit();
      });
    }
  }
}