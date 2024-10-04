import { Component, effect, inject, Input, OnInit } from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { IPost } from '../../../interfaces/posts';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import {MatButtonModule} from '@angular/material/button';
import { PostsStoreService } from '../../../store/posts-store.service';
import { firstValueFrom, Observable } from 'rxjs';
import { UtilService } from '../../../services/util.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserStoreService } from '../../../store/user-store.service';
import { IResponse } from '../../../interfaces/response';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule, 
    MatInputModule,
    QuillEditorComponent,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './post-editor.component.html',
  styleUrl: './post-editor.component.scss'
})
export class PostEditorComponent implements OnInit {


  #formBuilder = inject(FormBuilder);
  #postStore = inject(PostsStoreService);
  #userStore = inject(UserStoreService);
  #activatedRoute = inject(ActivatedRoute)
  #utils = inject(UtilService);
  #router = inject(Router)

  form = this.#formBuilder.group({
    id: [''],
    title: ['', [Validators.required, Validators.minLength(5)]],
    body: ['', [Validators.required, Validators.minLength(15)]],
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

  constructor(){
    effect(() => {
      this.populeUserInForm();
      
    })
  }


  ngOnInit(): void {
    this.getPost();
  }

  async getPost(){
    const slug = this.#activatedRoute.snapshot.paramMap.get('slug');
    if(!slug){return}
    await firstValueFrom(this.#postStore.getOneApi(slug));
    const currentPost = this.#postStore.currentPost() as any;
    console.log("current post", currentPost);
    
    if(!currentPost){return}
    this.form.patchValue({...currentPost})

  }

  populeUserInForm(){
    const user = this.#userStore.currentState();
    if(!user){return}
    this.form.patchValue({
      owner_id: +user.id,
      owner_username: user.displayName,
    })

  }


  async save(){
    if(!this.form.value.title){return}
    const slug = this.createSlug(this.form.value.title)
    const post = {...this.form.value, slug} as Partial<IPost>;
    let request$: Observable<IResponse>;
    if(post.id){
      request$ = this.#postStore.editOneApi(post);
    }else{
      request$ = this.#postStore.setOneApi(post);
    }

    const {error, results, message} = await firstValueFrom(request$);

    console.log(error, results, message);
    
    this.#utils.showMsg(message)
    if(error){
      return
    }

    this.#router.navigate([`/posts/${slug}`])
    console.log(post);
   
  }

  createSlug(title: string){
    return title
    .toLowerCase() // Converte para minúsculas
    .normalize("NFD") // Normaliza caracteres especiais
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres não alfanuméricos
    .trim() // Remove espaços no início e no fim
    .replace(/\s+/g, "-");  

  }


}
