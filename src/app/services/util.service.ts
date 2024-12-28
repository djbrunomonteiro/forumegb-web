import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { IResponse } from '../interfaces/response';
import { filter, firstValueFrom, map, mergeMap, Observable, of } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ETypeStage } from '../enums/enums';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  #snackBar = inject(MatSnackBar);
  #router = inject(Router);
  #http = inject(HttpClient);
  #meta = inject(Meta);
  #title = inject(Title);

  stageOpts = [
    {
      value: ETypeStage.MAINSTAGE,
      title: 'Main Stage',
      img: 'main.jpg',
      access: 'PRIVADO',
      description: 'Acesso exclusivo para membros. Contém músicas exclusivas, lançamentos e muito + !',
      color: 'red',
    },

    {
      value: ETypeStage.FLOORSTAGE,
      access: 'PÚBLICO',
      title: 'Floor Stage',
      img: 'floor.jpg',
      description: 'Visível para todos, Contém músicas, sets, seção de dúvidas e muito +.',
      color: '#064c6d',
    },

    {
      value: ETypeStage.BACKSTAGE,
      access: 'PÚBLICO',
      title: 'Back Stage',
      img: 'back.jpg',
      description: 'Visível para todos, perfeito para discussões informais, troca de experiências sobre os bastidores.',
      color: '#263028',
    },
  ];



  tagsPosts = [
    "Remixes e Mashups",
    "Faixas Originais",
    "Mixagens e Sets",
    "Produção Musical",
    "Dúvidas",
    "Equipamentos",
    "Eventos, Festivais e Shows",
    "Gêneros Musicais",
    "Softwares e Programas",
    "Sugestão e Melhorias",
    "Vendas e Aluguel",
    "Outros"
  ];

  iconsOpts = [
    'headphones', 'graphic_eq', 'music_note', 'help', 'person_raised_hand', 'info', 'blur_on', 'edit_note', 'repeat_on', 'shopping_cart'
  ]

  navState = signal<any[]>([]);
  navState$ = toObservable<any[]>(this.navState);
  currentNavState = signal<any>(undefined);


  setTitleDesc(title: string, description: string){
    this.#title.setTitle(title);
    this.#meta.updateTag({ name: 'description', content: description });
  }

  setTags( tags: any[]){
    this.#meta.addTags(tags)
  }



  listenCurrentNavState() {
    this.#router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(async (event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.navState.update((current) => current.concat([{ url }]));
        this.currentNavState.set({ url })
      });
  }



  successExtract(res: any) {
    const results = this.paramsJsonParse(res.results);
    const response: IResponse = { error: false, results, message: res?.message }
    return response;
    ;
  }

  errorExtract(res: any) {
    const message = String(res?.message).includes('failure') ? 'Desculpe, o servidor não está acessível no momento ou sua conexão falhou.' : res?.message
    const response: IResponse = { error: true, results: res?.results ?? undefined, message }
    return of(response);
  }

  showMsg(msg: string = '', action = 'X', config: MatSnackBarConfig = { duration: 4000, panelClass: 'default-snackbar' }) {
    this.#snackBar.open(msg, action, config)
  }

  sortArrayByKey<T>(array: T[] = [], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    if (!array || typeof (array) !== 'object') { return [] }
    return array.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  paramsJsonParse(itemRef: any[] | object): any[] | object {
    let result;
    if (!itemRef) {
      return itemRef;
    }
    if (Array.isArray(itemRef)) {
      result = itemRef.map((elem) => this.checkParamIsJson(elem));
    } else if (typeof itemRef === 'object') {
      result = this.checkParamIsJson(itemRef);
    } else {
      return itemRef;
    }

    return result;
  }

  checkParamIsJson(item: any) {
    for (const key in item) {
      if (this.validJsonStr(item[key])) {
        item[key] = JSON.parse(item[key]);
      }
    }
    return item;
  }

  validJsonStr(str: any) {
    if (str === null || str === 'null') return false;
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  sortByLikes(arr: any[]) {
    // Mapeia os objetos para incluir a contagem de likes
    const withLikesCount = arr.map(obj => ({
      ...obj,
      likesCount: obj.likes.length
    }));

    // Ordena os objetos com base no número de likes
    const sorted = withLikesCount.sort((a, b) => b.likesCount - a.likesCount);

    // Remove a propriedade likesCount antes de retornar
    return sorted.map(({ likesCount, ...rest }) => rest);
  }

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);  // Lê o Blob e converte em Base64
    });
  }

  base64ToBlob(base64: string): Blob {
    // Remove o prefixo 'data:[<mimeType>];base64,' da string base64
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);

    // Converte cada caractere em seu valor correspondente em byte
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // Converte os bytes em uma unidade de armazenamento do tipo Uint8Array
    const byteArray = new Uint8Array(byteNumbers);

    // Cria o Blob a partir dos dados binários e do mime type especificado
    return new Blob([byteArray], { type: 'audio/mp3' });
  }

  getImageAsBase642(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Cria um elemento de imagem
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Isso ajuda a contornar problemas de CORS em alguns casos

      // Define a URL da imagem
      img.src = url;

      // Quando a imagem é carregada, converte-a para base64 usando canvas
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } else {
          console.log('Erro ao obter o contexto do canvas.');
          resolve('');
        }
      };

      // Em caso de erro de carregamento, rejeita a Promise
      img.onerror = () => {
        console.log('Erro ao obter o contexto do canvas.');
        resolve('');
      };
    });
  }

  getImageAsBase64(url: any) {
    if (!url) { return of('') }
    return this.#http.get(url, { responseType: 'blob' }).pipe(
      mergeMap((blob) => {
        const reader = new FileReader();
        let base64data = '';
        reader.onloadend = () => {
          base64data = reader?.result ? reader?.result as string : ''
        };

        reader.onerror = () => {
          base64data = '';
        };
        reader.readAsDataURL(blob);
        return base64data as string

      })
    )
  }

}


