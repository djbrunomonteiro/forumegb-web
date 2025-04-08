import { Component, inject } from '@angular/core';
import { UserStoreService } from '../../../store/user-store.service';
import {MatDialogModule} from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-info-new-user',
    imports: [
        RouterLink,
        MatDialogModule,
        MatButtonModule
    ],
    templateUrl: './info-new-user.component.html',
    styleUrl: './info-new-user.component.scss'
})
export class InfoNewUserComponent {
  userStore = inject(UserStoreService);

  email = 'egbhub@gmail.com'


}
