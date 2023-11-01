import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementRacesComponent } from './management-races.component';

describe('ManagementRacesComponent', () => {
  let component: ManagementRacesComponent;
  let fixture: ComponentFixture<ManagementRacesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementRacesComponent]
    });
    fixture = TestBed.createComponent(ManagementRacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
