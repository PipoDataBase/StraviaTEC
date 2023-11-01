import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManagementRacesComponent } from './management-races.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ManagementRacesComponent }
    ])],
    exports: [RouterModule]
})
export class ManagementRacesRoutingModule { }