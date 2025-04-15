import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { TodoItemModel } from '../models/todo-item.model';
import { ApiResponse } from '../models/api-response-model';
import { CreateTodoRequest } from '../models/create-todo-request.model';
import { UpdateTodoRequest } from '../models/update-todo-request.model';
import { RegisterProgressionRequest } from '../models/register-progression-request.model';
import { environment } from '../../environments/environment.development';

@Injectable({
     providedIn: 'root'
})
export class TodoService {
     private apiUrl = `${environment.apiBaseUrl}/Todo`;
     private todosSignal = signal<TodoItemModel[]>([]);
     public todos = this.todosSignal.asReadonly();

     constructor(private http: HttpClient) {
          this.loadTodos();
     }

     private loadTodos(): void {
          this.http.get<ApiResponse<TodoItemModel>>(this.apiUrl).pipe(
               map(response => response.content || []),
               catchError(() => of([]))
          ).subscribe(todos => {
               this.todosSignal.set(todos);
          });
     }

     getTodoById(id: number): Observable<TodoItemModel | null> {
          return this.http.get<ApiResponse<TodoItemModel>>(`${this.apiUrl}/${id}`).pipe(
               map(response => response.content?.[0] || null),
               catchError(() => of(null))
          );
     }

     createTodo(request: CreateTodoRequest): Observable<TodoItemModel | null> {
          return this.http.post<ApiResponse<TodoItemModel>>(this.apiUrl, request).pipe(
               map(response => response.content?.[0] || null),
               tap(newTodo => {
                    if (newTodo) {
                         this.todosSignal.update(todos => [...todos, newTodo]);
                    }
               }),
               catchError(() => of(null))
          );
     }

     updateTodo(id: number, request: UpdateTodoRequest): Observable<TodoItemModel | null> {
          return this.http.put<ApiResponse<TodoItemModel>>(`${this.apiUrl}/${id}`, request).pipe(
               map(response => response.content?.[0] || null),
               tap(updatedTodo => {
                    if (updatedTodo) {
                         this.todosSignal.update(todos =>
                              todos.map(todo => todo.id === id ? updatedTodo : todo)
                         );
                    }
               }),
               catchError(() => of(null))
          );
     }

     deleteTodo(id: number): Observable<boolean> {
          return this.http.delete<ApiResponse<TodoItemModel>>(`${this.apiUrl}/${id}`).pipe(
               map(() => true),
               tap(() => {
                    this.todosSignal.update(todos => todos.filter(todo => todo.id !== id));
               }),
               catchError(() => of(false))
          );
     }

     registerProgression(id: number, request: RegisterProgressionRequest): Observable<TodoItemModel | null> {
          return this.http.post<ApiResponse<TodoItemModel>>(`${this.apiUrl}/${id}/progression`, request).pipe(
               map(response => response.content?.[0] || null),
               tap(updatedTodo => {
                    if (updatedTodo) {
                         this.todosSignal.update(todos =>
                              todos.map(todo => todo.id === id ? updatedTodo : todo)
                         );
                    }
               }),
               catchError(() => of(null))
          );
     }
}