import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'management-races', loadChildren: () => import('./management-races/management-races.module').then(m => m.ManagementRacesModule) },
        { path: 'management-challenges', loadChildren: () => import('./management-challenges/management-challenges.module').then(m => m.ManagementChallengesModule) },
        { path: 'management-groups', loadChildren: () => import('./management-groups/management-groups.module').then(m => m.ManagementGroupsModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ManagementRoutingModule { }