import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementGroupsRoutingModule } from './management-groups-routing.module';
import { ManagementGroupsComponent } from './management-groups.component';

@NgModule({
    imports: [
        CommonModule,
        ManagementGroupsRoutingModule
    ],
    declarations: [ManagementGroupsComponent]
})
export class ManagementGroupsModule { }