import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementChallengesRoutingModule } from './management-challenges-routing.module';
import { ManagementChallengesComponent } from './management-challenges.component';

@NgModule({
    imports: [
        CommonModule,
        ManagementChallengesRoutingModule
    ],
    declarations: [ManagementChallengesComponent]
})
export class ManagementChallengesModule { }