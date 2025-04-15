import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressionFormComponent } from './progression-form.component';

describe('ProgressionFormComponent', () => {
  let component: ProgressionFormComponent;
  let fixture: ComponentFixture<ProgressionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressionFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProgressionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
