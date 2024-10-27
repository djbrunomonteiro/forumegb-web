import { Component, inject } from '@angular/core'
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { UserStoreService } from '../../../store/user-store.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatChipsModule} from '@angular/material/chips';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatMenuModule,
    MatChipsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userStore = inject(UserStoreService);
  #auth = inject(AuthService);
  #router = inject(Router);

  async logout(){
    await this.#auth.logout()
    this.userStore.setState(undefined);
    this.#router.navigate(['/'])
  }


  

}
