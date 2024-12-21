import { Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { AuthService } from './services/auth.service';
import { UtilService } from './services/util.service';
import { firstValueFrom } from 'rxjs';
import { MetadataStoreService } from './store/metadata-store.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BanneHomeComponent } from './components/layout/banne-home/banne-home.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MatProgressBarModule,
    BanneHomeComponent,
    NgClass
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  auth = inject(AuthService);
  #utils = inject(UtilService);
  metadata = inject(MetadataStoreService);
  title = 'egbhub-web';
  
  async ngOnInit(){
    this.#utils.listenCurrentNavState();
    await firstValueFrom(this.auth.checkAuth());
    ;
  }


}
