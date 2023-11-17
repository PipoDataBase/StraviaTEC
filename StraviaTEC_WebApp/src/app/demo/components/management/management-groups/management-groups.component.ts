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
  groupMembersDialog: boolean = false;
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

  seeGroup(group: Group) {
    this.group = { ...group };
    this.groupMembersDialog = true;
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

  hideGroupMembersDialog() {
    this.groupMembersDialog = false;
  }

  saveGroup() {
    this.submitted = true;

    if (!this.group.name) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'The group name must not be empty.' });
      return;
    }

    const groupFound = this.groups.find((g) => g.name == this.group.name);
    if (groupFound) {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Group: ' + this.group.name + ' already exists.' });
      return;
    }

    // Post group
    this.groupsService.postGroup(this.group.name, this.sharedService.getUsername()).subscribe({
      next: (response) => {
        if (response) {
          this.updateGroups();
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Group Created.', life: 3000 });
        }
      },
      error: (response) => {
        console.log(response);
        return;
      }
    })

    this.groupDialog = false;
    this.group = {};
  }

  saveGroupMembers() {
    this.groupMembersDialog = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
