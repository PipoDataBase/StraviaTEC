import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AvatarModule } from 'primeng/avatar';
import { InputMaskModule } from "primeng/inputmask";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { CarouselModule } from 'primeng/carousel';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
    imports: [
        CommonModule,
        SearchRoutingModule,
        AngularMaterialModule,
        AvatarModule,
		InputMaskModule,
		InputTextareaModule,
		InputTextModule,
		ButtonModule,
        SkeletonModule,
        ImageModule,
        GalleriaModule,
        CarouselModule
    ],
    declarations: [SearchComponent]
})
export class SearchModule { }