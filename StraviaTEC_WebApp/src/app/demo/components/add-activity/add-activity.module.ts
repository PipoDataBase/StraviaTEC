import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddActivityRoutingModule } from './add-activity-routing.module';
import { AddActivityComponent } from './add-activity.component';

@NgModule({
    imports: [
        CommonModule,
        AddActivityRoutingModule
    ],
    declarations: [AddActivityComponent]
})
export class AddActivityModule { }
