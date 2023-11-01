import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementRacesRoutingModule } from './management-races-routing.module';
import { ManagementRacesComponent } from './management-races.component';

@NgModule({
    imports: [
        CommonModule,
        ManagementRacesRoutingModule
    ],
    declarations: [ManagementRacesComponent]
})
export class ManagementRacesModule { }