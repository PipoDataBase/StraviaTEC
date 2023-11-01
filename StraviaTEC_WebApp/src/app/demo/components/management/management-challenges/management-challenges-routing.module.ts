import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManagementChallengesComponent } from './management-challenges.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ManagementChallengesComponent }
    ])],
    exports: [RouterModule]
})
export class ManagementChallengesRoutingModule { }