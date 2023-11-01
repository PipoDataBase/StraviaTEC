import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscriptionsChallengesRoutingModule } from './inscriptions-challenges-routing.module';
import { InscriptionsChallengesComponent } from './inscriptions-challenges.component';

@NgModule({
    imports: [
        CommonModule,
        InscriptionsChallengesRoutingModule
    ],
    declarations: [InscriptionsChallengesComponent]
})
export class InscriptionsChallengesModule { }