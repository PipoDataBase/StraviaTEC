import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRacesRoutingModule } from './reports-races-routing.module';
import { ReportsRacesComponent } from './reports-races.component';
import { IonicModule } from '@ionic/angular'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
    imports: [
        CommonModule,
        ReportsRacesRoutingModule,
        IonicModule
    ],
    declarations: [ReportsRacesComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportsRacesModule { }