import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportsRacesComponent } from './reports-races.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ReportsRacesComponent }
    ])],
    exports: [RouterModule]
})
export class ReportsRacesRoutingModule { }