import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionsChallengesComponent } from './inscriptions-challenges.component';

describe('InscriptionsChallengesComponent', () => {
  let component: InscriptionsChallengesComponent;
  let fixture: ComponentFixture<InscriptionsChallengesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscriptionsChallengesComponent]
    });
    fixture = TestBed.createComponent(InscriptionsChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
