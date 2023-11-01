import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManagementGroupsComponent } from './management-groups.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ManagementGroupsComponent }
    ])],
    exports: [RouterModule]
})
export class ManagementGroupsRoutingModule { }