import { Component, inject } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { RouterLink, RouterModule } from '@angular/router';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-menu-side',
  standalone: true,
  imports: [
    RouterModule,
    NgStyle
  ],
  templateUrl: './menu-side.component.html',
  styleUrl: './menu-side.component.scss'
})
export class MenuSideComponent {

  utils = inject(UtilService);

}
