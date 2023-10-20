import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PPublicPresentationComponent } from './p-public_presentation.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '0001',
  //   pathMatch: 'full'
  // },
  {
    path: '**',
    component: PPublicPresentationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PBaseRoutingModule { }
