import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SharedService } from 'src/app/services/shared.service';
import { Group } from 'src/app/models/group.module';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-management-groups',
  templateUrl: './management-groups.component.html',
  styleUrls: ['./management-groups.component.scss'],
  providers: [MessageService]
})
export class ManagementGroupsComponent {
  groupDialog: boolean = false;
  deleteGroupDialog: boolean = false;
  deleteGroupsDialog: boolean = false;

  groups: Group[] = [];
  selectedGroups: Group[] = [];
  group: Group = {};

  submitted: boolean = false;

  constructor(private messageService: MessageService, private groupsService: GroupsService, private sharedService: SharedService) { }

  updateGroups() {
    this.groupsService.getGroupsByManager(this.sharedService.getUsername()).subscribe({
      next: (groups) => {
        this.groups = groups;
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  ngOnInit() {
    this.updateGroups();
  }

  openNew() {
    this.group = {};
    this.submitted = false;
    this.groupDialog = true;
  }

  editGroup(group: Group) {
    this.group = { ...group };
    this.groupDialog = true;
  }

  deleteGroup(group: Group) {
    this.deleteGroupDialog = true;
    this.group = { ...group };
  }

  confirmDelete() {
    this.deleteGroupDialog = false;
    // Delete group
    this.groupsService.deleteGroup(this.group.name).subscribe({
      next: (response) => {
        if (response) {
          this.updateGroups();
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Group Deleted.', life: 3000 });
        }
      },
      error: (response) => {
        console.log(response);
        return;
      }
    })

    this.group = {};
  }

  deleteSelectedGroups() {
    this.deleteGroupsDialog = true;
  }

  confirmDeleteSelected() {
    this.deleteGroupsDialog = false;
    for (var group of this.selectedGroups) {
      // Delete group
      this.groupsService.deleteGroup(group.name).subscribe({
        next: (response) => {
          if (response) {
            this.updateGroups();
          }
        },
        error: (response) => {
          console.log(response);
          return;
        }
      })
    }

    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Groups Deleted.', life: 3000 });
    this.selectedGroups = [];
  }

  hideDialog() {
    this.groupDialog = false;
    this.submitted = false;
  }

  saveGroup() {
    this.submitted = true;

    /*
    if (!this.isNewChallenge) {
      this.challenges = this.challenges.filter((challenge) => challenge.name !== this.challenge.name);
      const challengeUpdated: Challenge = {
        name: this.challenge.name,
        goal: this.challenge.goal,
        private: Boolean(String(this.selectedPrivacy) == "true"),
        startDate: this.challenge.startDate,
        endDate: this.challenge.endDate,
        deep: Boolean(String(this.selectedDeepHeight) == "true"),
        type: this.selectedActivityType
      }

      if (this.validateChallenge(challengeUpdated)) {
        // Put challenge
        this.challengesService.putChallenge(challengeUpdated.name, challengeUpdated).subscribe({
          next: (response) => {
            if (response) {
              this.updateChallenges();
              this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Challenge Updated.', life: 3000 });
            }
          },
          error: (response) => {
            console.log(response);
            return;
          }
        })
      }
      else {
        this.updateChallenges();
        return;
      }
    }
    else {
      const newChallenge: Challenge = {
        name: this.challenge.name,
        goal: this.challenge.goal,
        private: Boolean(String(this.selectedPrivacy) == "true"),
        startDate: this.challenge.startDate,
        endDate: this.challenge.endDate,
        deep: Boolean(String(this.selectedDeepHeight) == "true"),
        type: this.selectedActivityType
      }

      if (this.validateChallenge(newChallenge)) {
        // Post challenge
        this.challengesService.postChallenge(this.sharedService.getUsername(), newChallenge).subscribe({
          next: (response) => {
            if (response) {
              this.updateChallenges();
              this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Challenge Created.', life: 3000 });
            }
          },
          error: (response) => {
            console.log(response);
            return;
          }
        })
      }
      else {
        return;
      }
    }

    this.challengeDialog = false;
    this.challenge = {}
    */
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
