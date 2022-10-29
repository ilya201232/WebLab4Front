import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAccessPageComponent } from './no-access-page.component';

describe('NoAccessPageComponent', () => {
  let component: NoAccessPageComponent;
  let fixture: ComponentFixture<NoAccessPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoAccessPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoAccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
