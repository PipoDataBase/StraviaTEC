import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRacesRoutingModule } from './reports-races-routing.module';
import { ReportsRacesComponent } from './reports-races.component';

@NgModule({
    imports: [
        CommonModule,
        ReportsRacesRoutingModule
    ],
    declarations: [ReportsRacesComponent]
})
export class ReportsRacesModule { }