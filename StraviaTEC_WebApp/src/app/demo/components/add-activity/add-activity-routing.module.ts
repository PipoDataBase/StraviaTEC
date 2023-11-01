import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddActivityComponent } from './add-activity.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AddActivityComponent }
    ])],
    exports: [RouterModule]
})
export class AddActivityRoutingModule { }