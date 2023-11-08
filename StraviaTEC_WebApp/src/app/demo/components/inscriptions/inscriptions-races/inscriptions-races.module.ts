import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscriptionsRacesRoutingModule } from './inscriptions-races-routing.module';
import { InscriptionsRacesComponent } from './inscriptions-races.component';
import { DataViewModule } from 'primeng/dataview';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';


import { InputTextareaModule } from 'primeng/inputtextarea';



@NgModule({
    imports: [
        CommonModule,
        InscriptionsRacesRoutingModule,
        DataViewModule,
        PickListModule,
        OrderListModule,
        InputTextModule,
        DropdownModule,
        RatingModule,
        ButtonModule,
        ChipModule,
        TagModule,
        DialogModule,
        ToastModule,
        TableModule,
        InputTextareaModule,
        FileUploadModule,
        FormsModule
    ],
    declarations: [InscriptionsRacesComponent]
})
export class InscriptionsRacesModule { }