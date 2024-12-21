import { Component, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { UserStoreService } from '../../../store/user-store.service';
import { IUser } from '../../../interfaces/user';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { CurrencyPipe, DatePipe, isPlatformBrowser, NgClass } from '@angular/common';
import { MetadataStoreService } from '../../../store/metadata-store.service';
import { firstValueFrom } from 'rxjs';
import { UtilService } from '../../../services/util.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import dayjs from 'dayjs'
import { PaymentService } from '../../../services/payment.service';
import { EPlanTypes } from '../../../enums/enums';
import {MatCardModule} from '@angular/material/card';
import { CheckRecentPlanEligibilityPipe } from '../../../pipes/check-recent-plan-eligibility.pipe';

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
    ImageCropperComponent,
    MatProgressBarModule,
    DatePipe,
    CurrencyPipe,
    MatCardModule,
    CheckRecentPlanEligibilityPipe,
    NgClass
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
  #formBuilder = inject(FormBuilder);
  userStore = inject(UserStoreService);
  #utils = inject(UtilService);
  #paymentService = inject(PaymentService);
  metadataStore = inject(MetadataStoreService);
  platformId = inject(PLATFORM_ID);
  isPlatformBrowser = isPlatformBrowser;




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

  imageChangedEvent: Event | null = null;
  croppedImage: any  = '';
  isEditImg = signal(false);

  EPlantypes = EPlanTypes;

  pricesPlans = [
    {
      title: `ACESSO ${EPlanTypes.TRIMESTRAL}`,
      type: EPlanTypes.TRIMESTRAL,
      amount: 30,
      desconto: 1,
      img: 'main.jpg',
      description: 'Acesso exclusivo durante o periodo de 3 meses!',
      color: 'red',
    },
    {
      title: `ACESSO ${EPlanTypes.SEMESTRAL}`,
      type: EPlanTypes.SEMESTRAL,
      amount: 60,
      desconto: 1,
      img: 'main.jpg',
      description: 'Acesso exclusivo durante o periodo de 6 meses!',
      color: 'red',
    },
    {
      title: `ACESSO ${EPlanTypes.ANUAL}`,
      type: EPlanTypes.ANUAL,
      amount: 120,
      desconto: 1,
      img: 'main.jpg',
      description: 'Acesso exclusivo durante o periodo de 1 ano!',
      color: 'red',
    },

  ];


  constructor(){
    effect(() => {
      if(this.userStore.currentState()){
        this.setForm(this.userStore.currentState());
        this.setAmountFistPlan();
      }
    })

  }

  setAmountFistPlan(){
    const user = this.userStore.currentState();
    if(!user){return}
    const notPlan = user.plan?.hasOwnProperty('plan_type');
    if(!user.plan?.hasOwnProperty('plan_type') || user.plan?.plan_type === ''){
      this.pricesPlans[0].desconto = 0.5
      return
    };

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

  async save(){

    let metadata = this.form.value.metadata as any;
    metadata = {...metadata, updated_at: dayjs().toISOString()}
    const user = {...this.form.value, metadata: JSON.stringify(metadata)} as Partial<IUser>;
    const {message} = await firstValueFrom(this.userStore.saveOne(user));
    this.#utils.showMsg(message);
  }

  cancelImg(){
    this.isEditImg.set(false);
    this.croppedImage = '';
  }

  saveImg(){
    this.ctrlPhotoUrl.setValue(this.croppedImage);
    this.save()
    this.cancelImg();
  }

  fileChangeEvent(event: Event): void {
    if(!event){return}
    this.isEditImg.set(true);
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    if(!event){return}
    this.croppedImage = event.base64;
  }


  async checkout(plan_type: string = EPlanTypes.TRIMESTRAL){
    const {id, email} = this.form.value
    const form = {plan_type, user_id: id, user_email: email };

    const {error, results, message } = await firstValueFrom(this.#paymentService.getPref(form));
    if(error){return}

    const preference_id = results?.preference_id;
    this.#paymentService.initCheckout(preference_id)
    

  }

}
