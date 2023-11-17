import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';

@NgModule({
    imports: [
        CommonModule,
        HomeRoutingModule,
        AngularMaterialModule,
        AvatarModule,
        SkeletonModule,
        FormsModule,
        FieldsetModule,
        PanelModule,
        CardModule,
        MatExpansionModule,
        ReactiveFormsModule,
        InputTextareaModule,
        ButtonModule,
        RippleModule,
        DividerModule
    ],
    declarations: [HomeComponent]
})
export class HomeModule { }