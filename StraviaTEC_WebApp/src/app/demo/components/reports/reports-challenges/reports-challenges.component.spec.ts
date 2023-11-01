import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsChallengesComponent } from './reports-challenges.component';

describe('ReportsChallengesComponent', () => {
  let component: ReportsChallengesComponent;
  let fixture: ComponentFixture<ReportsChallengesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsChallengesComponent]
    });
    fixture = TestBed.createComponent(ReportsChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
