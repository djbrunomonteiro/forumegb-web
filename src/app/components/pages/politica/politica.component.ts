import { Component, inject } from '@angular/core';
import { UtilService } from '../../../services/util.service';

@Component({
    selector: 'app-politica',
    imports: [],
    templateUrl: './politica.component.html',
    styleUrl: './politica.component.scss'
})
export class PoliticaComponent {

  #utils = inject(UtilService);

  email = 'egbhub@gmail.com';

  constructor(){
    const title = `EGB HUB - Política de privacidade e os termos de uso.`;
    const description = `Confira a política de privacidade e os termos de uso no fórum EGB HUB.`;
    this.#utils.setTitleDesc(title, description);
  }

}
