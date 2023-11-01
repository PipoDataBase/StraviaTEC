import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionsRacesComponent } from './inscriptions-races.component';

describe('InscriptionsRacesComponent', () => {
  let component: InscriptionsRacesComponent;
  let fixture: ComponentFixture<InscriptionsRacesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscriptionsRacesComponent]
    });
    fixture = TestBed.createComponent(InscriptionsRacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
