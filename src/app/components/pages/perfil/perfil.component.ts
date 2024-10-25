import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { UserStoreService } from '../../../store/user-store.service';
import { IUser } from '../../../interfaces/user';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
  #formBuilder = inject(FormBuilder);
  #userStore = inject(UserStoreService);

  form = this.#formBuilder.group({
    id:[0],
    displayName:['', [Validators.required, Validators.minLength(3)]],
    email:[''],
    social_links:[''],
    permission:[''],
    photoURL:[''],
    metadata:[''],
    end_uf:[''],
  });

  ctrlPhotoUrl = this.form.get('photoURL') as FormControl;


  ufsBR = [
    { uf: 'AC', nome: 'Acre' },
    { uf: 'AL', nome: 'Alagoas' },
    { uf: 'AP', nome: 'Amapá' },
    { uf: 'AM', nome: 'Amazonas' },
    { uf: 'BA', nome: 'Bahia' },
    { uf: 'CE', nome: 'Ceará' },
    { uf: 'DF', nome: 'Distrito Federal' },
    { uf: 'ES', nome: 'Espírito Santo' },
    { uf: 'GO', nome: 'Goiás' },
    { uf: 'MA', nome: 'Maranhão' },
    { uf: 'MT', nome: 'Mato Grosso' },
    { uf: 'MS', nome: 'Mato Grosso do Sul' },
    { uf: 'MG', nome: 'Minas Gerais' },
    { uf: 'PA', nome: 'Pará' },
    { uf: 'PB', nome: 'Paraíba' },
    { uf: 'PR', nome: 'Paraná' },
    { uf: 'PE', nome: 'Pernambuco' },
    { uf: 'PI', nome: 'Piauí' },
    { uf: 'RJ', nome: 'Rio de Janeiro' },
    { uf: 'RN', nome: 'Rio Grande do Norte' },
    { uf: 'RS', nome: 'Rio Grande do Sul' },
    { uf: 'RO', nome: 'Rondônia' },
    { uf: 'RR', nome: 'Roraima' },
    { uf: 'SC', nome: 'Santa Catarina' },
    { uf: 'SP', nome: 'São Paulo' },
    { uf: 'SE', nome: 'Sergipe' },
    { uf: 'TO', nome: 'Tocantins' }
  ];
  

  constructor(){
    effect(() => {
      if(this.#userStore.currentState()){
        this.setForm(this.#userStore.currentState())
      }
      
      
      
    })
  }

  setForm(user: IUser | undefined){
    if(!user){return}
    this.form.patchValue({
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      social_links: user?.social_links,
      permission: user?.permission,
      photoURL: user?.photoURL ?? '',
      metadata: user?.metadata,
      end_uf: user?.end_uf
    })

  }

  save(){
    console.log(this.form.value);
    
  }
}
