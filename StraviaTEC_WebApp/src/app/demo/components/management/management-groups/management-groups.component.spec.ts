import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementGroupsComponent } from './management-groups.component';

describe('ManagementGroupsComponent', () => {
  let component: ManagementGroupsComponent;
  let fixture: ComponentFixture<ManagementGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementGroupsComponent]
    });
    fixture = TestBed.createComponent(ManagementGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
