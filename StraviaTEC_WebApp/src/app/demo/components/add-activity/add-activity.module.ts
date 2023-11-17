import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddActivityRoutingModule } from './add-activity-routing.module';
import { AddActivityComponent } from './add-activity.component';
import { InputMaskModule } from 'primeng/inputmask';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
    imports: [
        CommonModule,
        AddActivityRoutingModule,
        InputMaskModule,
        ReactiveFormsModule,
        FormsModule,
        InputTextModule,
        InputNumberModule
    ],
    declarations: [AddActivityComponent]
})
export class AddActivityModule { }
