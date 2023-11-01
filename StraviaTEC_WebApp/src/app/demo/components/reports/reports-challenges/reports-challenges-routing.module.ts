import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportsChallengesComponent } from './reports-challenges.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ReportsChallengesComponent }
    ])],
    exports: [RouterModule]
})
export class ReportsChallengesRoutingModule { }