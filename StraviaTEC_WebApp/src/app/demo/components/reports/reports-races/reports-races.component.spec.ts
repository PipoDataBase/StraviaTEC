import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsRacesComponent } from './reports-races.component';

describe('ReportsRacesComponent', () => {
  let component: ReportsRacesComponent;
  let fixture: ComponentFixture<ReportsRacesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsRacesComponent]
    });
    fixture = TestBed.createComponent(ReportsRacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
