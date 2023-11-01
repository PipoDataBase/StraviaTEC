import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscriptionsRacesRoutingModule } from './inscriptions-races-routing.module';
import { InscriptionsRacesComponent } from './inscriptions-races.component';

@NgModule({
    imports: [
        CommonModule,
        InscriptionsRacesRoutingModule
    ],
    declarations: [InscriptionsRacesComponent]
})
export class InscriptionsRacesModule { }