import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsChallengesRoutingModule } from './reports-challenges-routing.module';
import { ReportsChallengesComponent } from './reports-challenges.component';

@NgModule({
    imports: [
        CommonModule,
        ReportsChallengesRoutingModule
    ],
    declarations: [ReportsChallengesComponent]
})
export class ReportsChallengesModule { }