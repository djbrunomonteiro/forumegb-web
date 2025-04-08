import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { UserStoreService } from '../../../store/user-store.service';
import { TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-ad-banner',
    imports: [
        RouterLink,
        MatDialogModule,
        MatButtonModule,
        TitleCasePipe
    ],
    templateUrl: './ad-banner.component.html',
    styleUrl: './ad-banner.component.scss'
})
export class AdBannerComponent {
  userStore = inject(UserStoreService);
  email = 'egbhub@gmail.com';
}
