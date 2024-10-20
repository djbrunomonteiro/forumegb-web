import { Component, inject } from '@angular/core';
import { StageComponent } from '../stage/stage.component';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    StageComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  utils = inject(UtilService);

}
