import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InscriptionsChallengesComponent } from './inscriptions-challenges.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: InscriptionsChallengesComponent }
    ])],
    exports: [RouterModule]
})
export class InscriptionsChallengesRoutingModule { }