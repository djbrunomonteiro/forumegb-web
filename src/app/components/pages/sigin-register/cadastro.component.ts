import { Component, effect, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IUser } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import { UserStoreService } from '../../../store/user-store.service';
import { UtilService } from '../../../services/util.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoNewUserComponent } from '../../shared/info-new-user/info-new-user.component';
import { MetadataStoreService } from '../../../store/metadata-store.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../services/analytics.service';


@Component({
    selector: 'app-cadastro',
    imports: [
        MatCardModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        InfoNewUserComponent,
        MatProgressBarModule,
        CommonModule,
        RouterLink
    ],
    templateUrl: './cadastro.component.html',
    styleUrl: './cadastro.component.scss'
})
export class CadastroComponent{
  #formBuilder = inject(FormBuilder);
  #authService = inject(AuthService);
  #userStoreService = inject(UserStoreService);
  #userService = inject(UserService);
  #utils = inject(UtilService);
  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);
  #dialog = inject(MatDialog);
  metadata = inject(MetadataStoreService);
  analytics = inject(AnalyticsService);

  form = this.#formBuilder.group({
    check: [false, Validators.required],
  });

  ctrlCheck = this.form.get('check') as FormControl;

  async signInGoogleProvider(){
    const resultProvider = await this.#authService.signInWithPopup();
    const user = resultProvider.user
    const {email, photoURL, displayName, metadata} = user;

    const {error, results} = await firstValueFrom(this.#userService.isNewUser(email)) ;


    if(error){return}
    if(results?.length){
      
      this.#userStoreService.setState(results[0]);

      const queryParms = await firstValueFrom(this.#activatedRouter.queryParamMap);
      const url = queryParms.get('redirect') ?? '/perfil';
      this.analytics.setLog('login', {name: results?.email});
      this.#router.navigate([url]);
      return
    }

    if(!email){return}
    const photoBase64 = photoURL ? await this.#utils.getImageAsBase642(photoURL) : ''
    const newUser: Partial<IUser> = {  email, photoURL: photoBase64, displayName, metadata: JSON.stringify(metadata), }
    this.saveInApi(newUser);

  }

  async saveInApi(user: IUser | Partial<IUser>){
    const {error, results} = await firstValueFrom(this.#userStoreService.saveOne(user));
    if(error){return}
    this.analytics.setLog('sign_up', {name: results?.email})
    this.#router.navigate(['/perfil']);
    this.openDialog();
  }

  openDialog() {
    this.#dialog.open(InfoNewUserComponent, {minWidth: '400px'});
  }
}
