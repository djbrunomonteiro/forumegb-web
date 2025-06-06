import { Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { AuthService } from './services/auth.service';
import { UtilService } from './services/util.service';
import { firstValueFrom } from 'rxjs';
import { MetadataStoreService } from './store/metadata-store.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BanneHomeComponent } from './components/layout/banne-home/banne-home.component';
import { isPlatformBrowser, NgClass } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
        MatProgressBarModule,
        BanneHomeComponent,
        NgClass,
        MatSidenavModule,
        RouterLink,
        MatButtonModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  auth = inject(AuthService);
  #utils = inject(UtilService);
  metadata = inject(MetadataStoreService);
  platformId = inject(PLATFORM_ID);
  title = 'egbhub-web';

  async ngOnInit(){
    this.#utils.listenCurrentNavState();
    await firstValueFrom(this.auth.checkAuth());
    this.setupQuill()
  }

  async setupQuill() {
    if(isPlatformBrowser(this.platformId)){
      const Quill = (await import('quill')).default;
      const ResizeImage = (await import('quill-resize-image')).default;
      Quill.register('modules/resizeImage', ResizeImage);

    }

  }
}
