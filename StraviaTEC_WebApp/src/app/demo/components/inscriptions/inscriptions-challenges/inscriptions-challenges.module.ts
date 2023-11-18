import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscriptionsChallengesRoutingModule } from './inscriptions-challenges-routing.module';
import { InscriptionsChallengesComponent } from './inscriptions-challenges.component';
import { DataViewModule } from 'primeng/dataview';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
    imports: [
        CommonModule,
        InscriptionsChallengesRoutingModule,
        DataViewModule,
        PickListModule,
        OrderListModule,
        InputTextModule,
        DropdownModule,
        RatingModule,
        ButtonModule,
        ChipModule,
        ProgressBarModule
    ],
    declarations: [InscriptionsChallengesComponent]
})
export class InscriptionsChallengesModule { }