import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: '',
                items: [
                    { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard/home'] },
                    { label: 'Profile', icon: 'pi pi-fw pi-user', routerLink: ['/dashboard/profile'] },
                    { label: 'Add Activity', icon: 'pi pi-fw pi-book', routerLink: ['/dashboard/add-activity'] },
                    { label: 'Search', icon: 'pi pi-fw pi-search', routerLink: ['/dashboard/search'] },
                    {
                        label: 'Inscriptions',
                        icon: 'pi pi-fw pi-check-square',
                        items: [
                            {
                                label: 'Races',
                                icon: 'pi pi-fw pi-flag',
                                routerLink: ['/dashboard/inscriptions/inscriptions-races']
                            },
                            {
                                label: 'Challenges',
                                icon: 'pi pi-fw pi-stopwatch',
                                routerLink: ['/dashboard/inscriptions/inscriptions-challenges']
                            }
                        ]
                    },
                    {
                        label: 'Management',
                        icon: 'pi pi-fw pi-cog',
                        items: [
                            {
                                label: 'Races',
                                icon: 'pi pi-fw pi-flag',
                                routerLink: ['/dashboard/management/management-races']
                            },
                            {
                                label: 'Challenges',
                                icon: 'pi pi-fw pi-stopwatch',
                                routerLink: ['/dashboard/management/management-challenges']
                            },
                            {
                                label: 'Groups',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['/dashboard/management/management-groups']
                            }
                        ]
                    },
                    { label: 'Race Reports', icon: 'pi pi-fw pi-copy', routerLink: ['/dashboard/reports-races'] }
                ]
            }
        ];
    }
}
