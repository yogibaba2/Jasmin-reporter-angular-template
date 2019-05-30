import { NgModule } from '@angular/core';
import {  MatSidenavModule,
          MatCheckboxModule,
          MatButtonModule,
          MatToolbarModule,
          MatIconModule,
          MatGridListModule,
          MatListModule,
          MatTreeModule,
          MatExpansionModule,
          MatCardModule,
          MatTooltipModule} from '@angular/material';

@NgModule({
  imports: [MatTooltipModule, MatCardModule, MatExpansionModule, MatSidenavModule, MatCheckboxModule, MatButtonModule, MatToolbarModule, MatIconModule, MatGridListModule, MatListModule, MatTreeModule],
  exports: [MatTooltipModule, MatCardModule, MatExpansionModule, MatSidenavModule, MatCheckboxModule, MatButtonModule, MatToolbarModule, MatIconModule, MatGridListModule, MatListModule, MatTreeModule]
})

export class MyOwnCustomMaterialModule { }