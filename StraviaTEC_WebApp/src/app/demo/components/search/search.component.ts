import { Component, OnInit } from '@angular/core';

// Models imports
import { SportmanNationality } from 'src/app/models/views-models/vw-sportman-nationality.module';
import { Group } from 'src/app/models/group.module';

// Services imports
import { SportmenService } from 'src/app/services/sportmen.service';
import { GroupsService } from 'src/app/services/groups.service';
import { SharedService } from 'src/app/services/shared.service';
import { MessageService } from 'primeng/api';

/*
export interface Sportman {
  username: string;
  name: string;
  lastName1: string;
  lastName2: string;
  birthDate: string;
  photoPath: string;
  password: string;
  nationalityId: number;
}
*/

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [MessageService]
})
export class SearchComponent implements OnInit {

  // Functional variables

  private loadingAnimation = false;
  public getLoadingAnimation() {
    return this.loadingAnimation;
  }
  public setLoadingAnimation(value) {
    this.loadingAnimation = value;
  }

  private showSearchResults = false;
  public getShowSearchResults() {
    return this.showSearchResults;
  }
  public setShowSearchResults(value) {
    this.showSearchResults = value;
  }

  isFoundUsersEmpty: boolean = true;
  isFoundGroupsEmpty: boolean = true;

  // Database variables

  private foundUsers: SportmanNationality[];
  public getFoundUsers(): SportmanNationality[] {
    return this.foundUsers;
  }
  public setFoundUsers(value: SportmanNationality[]) {
    this.foundUsers = value;
  }

  private foundGroups: Group[];
  public getFoundGroups(): Group[] {
    return this.foundGroups;
  }
  public setFoundGroups(value: Group[]) {
    this.foundGroups = value;
  }

  userFriends: SportmanNationality[] = [];
  participatingGroups: Group[] = [];

  //Other variables


  // Constructor
  constructor(private sportmenService: SportmenService, private groupsService: GroupsService, private sharedService: SharedService, private messageService: MessageService) { }

  ngOnInit() {

    // Loads user freinds
    this.sportmenService.getFriends(this.sharedService.getUsername()).subscribe({
      next: (userFriends) => {
        this.userFriends = userFriends;
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Friends loaded wrong.' });
      }
    })

    // Loads user participating groups
    this.sportmenService.getParticipatingGroups(this.sharedService.getUsername()).subscribe({
      next: (participatingGroups) => {
        this.participatingGroups = participatingGroups;
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Participating groups loaded wrong.' });
      }
    })
  }

  foundUserIsCurrentUser(foundUser: string): boolean {
    return foundUser.toLocaleLowerCase() === this.sharedService.getUsername().toLocaleLowerCase()
  }

  isUserAlreadyFriend(friendName: string): boolean {
    return this.userFriends.some(userFriend => userFriend.username.toLocaleLowerCase() === friendName.toLocaleLowerCase());
  }

  isUserParticipatingOnGroup(groupName: string): boolean {
    return this.participatingGroups.some(participatingGroup => participatingGroup.name.toLocaleLowerCase() === groupName.toLocaleLowerCase());
  }

  // Search button function: Searches on database for a match of any user or group
  searchButtonOnClick(searchInputValue: string) {
    this.foundUsers = [];
    this.foundGroups = [];
    this.isFoundUsersEmpty = true;
    this.isFoundGroupsEmpty = true;

    this.loadingAnimation = true;
    setTimeout(() => {
      this.loadingAnimation = false

      // Gets all users that match username input value
      this.sportmenService.getSearchSportman(searchInputValue).subscribe({
        next: (foundSportmen) => {
          this.foundUsers = foundSportmen;
          if (this.foundUsers.length == 0) {
            this.isFoundUsersEmpty = true;
          } else {
            this.isFoundUsersEmpty = false;
          }
        },
        error: (response) => {
          console.log(response);
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Challenges loaded wrong.' });
        }
      })

      // Gets all groups that match group name input value
      this.groupsService.getSearchGroups(searchInputValue).subscribe({
        next: (foundGroups) => {
          this.foundGroups = foundGroups;
          if (this.foundGroups.length == 0) {
            this.isFoundGroupsEmpty = true;
          } else {
            this.isFoundGroupsEmpty = false;
          }
        },
        error: (response) => {
          console.log(response);
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Challenges loaded wrong.' });
        }
      })

      this.showSearchResults = true

    },
      1000);
  }

  // Follow button function
  followUserButtonOnClick(username: string) {
    // Database request
    this.sportmenService.postAddFriend(this.sharedService.getUsername(), username).subscribe({
      next: () => {
        this.sportmenService.getFriends(this.sharedService.getUsername()).subscribe({
          next: (userFriends) => {
            this.userFriends = userFriends;
          },
          error: (response) => {
            console.log(response);
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Friends loaded wrong.' });
          }
        })
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Friend request sended wrong.' });
      }
    })
  }

  submitGroupButtonOnClick(name: string) {
    // Database request
    this.sportmenService.postJoinGroup(this.sharedService.getUsername(), name).subscribe({
      next: () => {
        this.sportmenService.getParticipatingGroups(this.sharedService.getUsername()).subscribe({
          next: (participatingGroups) => {
            this.participatingGroups = participatingGroups;
          },
          error: (response) => {
            console.log(response);
            this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Participating groups loaded wrong.' });
          }
        })
      },
      error: (response) => {
        console.log(response);
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Group join request sended wrong.' });
      }
    })
  }

  goToProfileButtonOnClick() {

  }

  unfollowUserButtonOnClick(username: string) {

  }

  leaveGroupButtonOnClick(groupName: string) {

  }
}
