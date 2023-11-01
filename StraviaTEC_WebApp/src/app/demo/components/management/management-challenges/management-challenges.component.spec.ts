import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementChallengesComponent } from './management-challenges.component';

describe('ManagementChallengesComponent', () => {
  let component: ManagementChallengesComponent;
  let fixture: ComponentFixture<ManagementChallengesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementChallengesComponent]
    });
    fixture = TestBed.createComponent(ManagementChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
