import { Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { AuthService } from './services/auth.service';
import { UtilService } from './services/util.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  auth = inject(AuthService);
  #utils = inject(UtilService);
  title = 'egbhub-web';
  

  ngOnInit(){
    this.#utils.listenCurrentNavState();
    this.auth.checkAuth();
  }


}
