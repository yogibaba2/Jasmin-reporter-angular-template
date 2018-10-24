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
          MatCardModule} from '@angular/material';

@NgModule({
  imports: [MatCardModule, MatExpansionModule, MatSidenavModule, MatCheckboxModule, MatButtonModule, MatToolbarModule, MatIconModule, MatGridListModule, MatListModule, MatTreeModule],
  exports: [MatCardModule, MatExpansionModule, MatSidenavModule, MatCheckboxModule, MatButtonModule, MatToolbarModule, MatIconModule, MatGridListModule, MatListModule, MatTreeModule]
})

export class MyOwnCustomMaterialModule { }