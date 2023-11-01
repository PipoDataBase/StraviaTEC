import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'reports-races', loadChildren: () => import('./reports-races/reports-races.module').then(m => m.ReportsRacesModule) },
        { path: 'reports-challenges', loadChildren: () => import('./reports-challenges/reports-challenges.module').then(m => m.ReportsChallengesModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ReportsRoutingModule { }