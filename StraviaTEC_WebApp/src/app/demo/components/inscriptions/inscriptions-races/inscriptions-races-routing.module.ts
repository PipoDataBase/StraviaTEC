import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InscriptionsRacesComponent } from './inscriptions-races.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: InscriptionsRacesComponent }
    ])],
    exports: [RouterModule]
})
export class InscriptionsRacesRoutingModule { }