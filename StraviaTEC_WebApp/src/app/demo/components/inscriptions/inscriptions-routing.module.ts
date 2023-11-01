import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'inscriptions-races', loadChildren: () => import('./inscriptions-races/inscriptions-races.module').then(m => m.InscriptionsRacesModule) },
        { path: 'inscriptions-challenges', loadChildren: () => import('./inscriptions-challenges/inscriptions-challenges.module').then(m => m.InscriptionsChallengesModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class InscriptionsRoutingModule { }