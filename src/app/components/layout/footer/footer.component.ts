import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterModule,
    MatDialogModule

  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  email = 'egbhub@gmail.com'

}
