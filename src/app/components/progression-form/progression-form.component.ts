import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { CommonModule } from '@angular/common';
import { RegisterProgressionRequest } from '../../models/register-progression-request.model';
import { TodoItemModel } from '../../models/todo-item.model';

@Component({
  selector: 'app-progression-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './progression-form.component.html',
  styleUrls: ['./progression-form.component.css']
})
export class ProgressionFormComponent {
  @Input() todo: TodoItemModel | null = null;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);

  progressionForm = this.fb.group({
    date: [this.getNextDayAfterMin(), this.dateValidator()],
    percent: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    this.updatePercentValidator();
  }

  updateDateControls() {
    this.progressionForm.patchValue({
      date: this.getNextDayAfterMin()
    });
    this.progressionForm.get('date')?.updateValueAndValidity();
  }

  updatePercentValidator() {
    const maxPercent = 100 - this.getTotalProgress();
    this.progressionForm.get('percent')?.setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(maxPercent)
    ]);
    this.progressionForm.get('percent')?.updateValueAndValidity();
  };

  getTotalProgress(): number {
    if (!this.todo?.progressions || this.todo.progressions.length === 0)
      return 0;

    const total = this.todo.progressions.reduce((sum, progression) => {
      return sum + (progression.percent || 0);
    }, 0);

    return Math.min(total, 100);
  }

  onSubmit(): void {
    if (this.progressionForm.invalid) return;

    const formValue = this.progressionForm.value;
    const request: RegisterProgressionRequest = {
      date: new Date(formValue.date || ''),
      percent: Number(formValue.percent)
    };

    this.todoService.registerProgression(this.todo?.id!, request).subscribe(() => {
      this.close.emit();
    });
  }

  getMinDate(): string {
    if (!this.todo?.progressions || this.todo.progressions.length === 0) {
      return new Date().toISOString().split('T')[0];
    }

    const sortedDates = this.todo.progressions
      .map(p => new Date(p.date))
      .sort((a, b) => b.getTime() - a.getTime());

    return sortedDates[0].toISOString().split('T')[0];
  }

  getNextDayAfterMin(): string {
    const minDate = new Date(this.getMinDate());
    minDate.setDate(minDate.getDate() + 1);

    return minDate.toISOString().split('T')[0];
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const minDate = new Date(this.getMinDate());
      return selectedDate >= minDate ? null : { minDate: true };
    };
  }
}