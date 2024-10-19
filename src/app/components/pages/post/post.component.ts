import { afterNextRender, AfterViewChecked, Component, ElementRef, Inject, inject, OnInit, PLATFORM_ID, signal, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostsStoreService } from '../../../store/posts-store.service';
import { IPost } from '../../../interfaces/posts';
import { PostChildComponent } from '../post-child/post-child.component';
import { UserStoreService } from '../../../store/user-store.service';
import { QuillEditorComponent } from 'ngx-quill';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { UtilService } from '../../../services/util.service';
import { MetadataStoreService } from '../../../store/metadata-store.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import WaveSurfer from 'wavesurfer.js';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../services/upload.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    PostChildComponent,
    QuillEditorComponent,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit, AfterViewChecked {
  
  #platformId = inject(PLATFORM_ID);
  #activatedRoute = inject(ActivatedRoute);
  #formBuilder = inject(FormBuilder);
  #utils = inject(UtilService);
  #upload = inject(UploadService);
  #el = inject(ElementRef);
  userStore = inject(UserStoreService);
  postStore = inject(PostsStoreService);
  metadataStore = inject(MetadataStoreService)

  form = this.#formBuilder.group({
    id: [''],
    title: [''],
    body: ['', [Validators.required]],
    music_preview: [''],
    source_url: [''],
    thumbnail: [''],
    slug: [''],
    owner_id: [0],
    owner_username: [''],
    metadata: [''],
    status: [''],
    parent_id: [null],
  });

  wavesurfer!: WaveSurfer;
  inEdition = signal(false);
  loading = signal(false);
  loadedLocale = signal(false);

  count = signal(0);

  constructor(){
    effect(() => {

    })
  }


  ngOnInit(): void {
    this.setCurrentPost();
  }

  ngAfterViewChecked(): void {
    // const music_preview = this.postStore.currentPost()?.music_preview;
    // this.loadPreviewLocale(music_preview);
  }

  async saveLike(idPost: number | undefined){
    const idUser = this.userStore.currentState()?.id;
    if(idUser&& idPost){
      const {error, results} = await firstValueFrom(this.postStore.setLike(+idUser, +idPost));
      if(error){return}
      const likes = results?.likes as any[];
      this.setCountLikes(likes)
    }
  }


  async setCurrentPost(){
    const slug = this.#activatedRoute.snapshot.paramMap.get('slug') ?? undefined;
    await this.postStore.setCurrentPost(slug);
    const likes = this.postStore.currentPost()?.likes ?? [];
    this.setCountLikes(likes);
    this.loadPreviewLocale();

  }

  async setCountLikes(likes: any[]){
    this.count.set(likes.length)
  }

  async loadPreviewLocale() {
    const music_preview = this.postStore.currentPost()?.music_preview;
    if(!music_preview || !isPlatformBrowser(this.#platformId)){return}
    const existLocale = localStorage.getItem(music_preview);
    let blob: Blob;
    if(!existLocale){
      const res = await firstValueFrom(this.#upload.getPreview(music_preview)) as any
      if(!res || res?.error){return}
      blob = res;
      const base64 =await this.blobToBase64(blob)
      localStorage.setItem(music_preview, base64);
    }else{
      blob = await this.base64ToBlob(existLocale)
      
    }
    const waveform = this.#el.nativeElement.querySelector('#waveform');
    if(!waveform){return}
 
    this.wavesurfer = WaveSurfer.create({
      container: waveform,
      waveColor: '#35e001',
      progressColor: '#383351',
      backend: 'WebAudio',
    });

    this.wavesurfer.loadBlob(blob);
    this.loadedLocale.set(true);
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

  async save(){
    const postFather = this.postStore.currentPost();
    const user = this.userStore.currentState();
    if(this.form.invalid || !postFather || !user){return}
    const newPost = {...this.form.value, parent_id: postFather.id, owner_id: user.id, owner_username: user.displayName} as Partial<IPost>
    const {error, message} = await firstValueFrom(this.postStore.setOneApi(newPost, postFather.id));
    this.#utils.showMsg(message)
    if(error){
      return
    }
    this.inEdition.set(false);
    this.form.patchValue({body:''});
  }
}
