import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddActivityRoutingModule } from './add-activity-routing.module';
import { AddActivityComponent } from './add-activity.component';
import { InputMaskModule } from 'primeng/inputmask';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    imports: [
        CommonModule,
        AddActivityRoutingModule,
        InputMaskModule,
        ReactiveFormsModule,
        FormsModule,
        InputTextModule,
        InputNumberModule,
        RippleModule,
        ToastModule,
        TableModule,
        FileUploadModule,
        ButtonModule,
        ToolbarModule,
        RatingModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        DialogModule,
        CalendarModule
    ],
    declarations: [AddActivityComponent]
})
export class AddActivityModule { }
