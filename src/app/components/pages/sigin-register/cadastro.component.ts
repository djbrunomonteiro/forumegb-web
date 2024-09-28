import { Component, inject, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';
import { IUser } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import { UserStoreService } from '../../../store/user-store.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent implements OnInit {
  #formBuilder = inject(FormBuilder);
  #authService = inject(AuthService);
  #userStoreService = inject(UserStoreService);
  #userService = inject(UserService);
  #router = inject(Router);

  form = this.#formBuilder.group({
    check: [false, Validators.required],
  });

  ctrlCheck = this.form.get('check') as FormControl;

  ngOnInit(): void {

  }

  async signInGoogleProvider(){
    const resultProvider = await this.#authService.signInWithPopup();
    const user = resultProvider.user
    const {email, photoURL, displayName, metadata} = user
    const {error, results} = await firstValueFrom(this.#userService.isNewUser(email)) ;
    if(error){return}
    if(results?.length){
      console.log('ja esta cadastrado');
      this.#userStoreService.setState(results[0]);
      this.#router.navigate(['']);
      return
    }

    if(!email){return}
    const newUser: IUser = {  email, photoURL, displayName, metadata: JSON.stringify(metadata), }
    this.saveInApi(newUser);

  }

  async saveInApi(user: IUser){
    const {error} = await firstValueFrom(this.#userStoreService.saveOne(user));
    if(error){return}
    this.#router.navigate(['']);
  }
  

}
