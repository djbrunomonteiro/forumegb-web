import { EPermission, EStatusPost } from './../../../enums/enums';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { IPost } from '../../../interfaces/posts';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MetadataStoreService } from '../../../store/metadata-store.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { PreviewEditorComponent } from '../../shared/preview-editor/preview-editor.component';
import { ETypeStage } from '../../../enums/enums';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgClass } from '@angular/common';
import { PreviewComponent } from '../../shared/preview/preview.component';
import { IUser } from '../../../interfaces/user';
import { AdBannerComponent } from '../../shared/ad-banner/ad-banner.component';

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
    RouterModule,
    MatDialogModule,
    MatRadioModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatDividerModule,
    MatCheckboxModule,
    NgClass,
    PreviewComponent,
    AdBannerComponent,
    MatIconModule
  ],
  templateUrl: './post-editor.component.html',
  styleUrl: './post-editor.component.scss'
})
export class PostEditorComponent implements OnInit {


  #formBuilder = inject(FormBuilder);
  #postStore = inject(PostsStoreService);
  #userStore = inject(UserStoreService);
  #activatedRoute = inject(ActivatedRoute);
  #router = inject(Router);
  #dialog = inject(MatDialog);
  utils = inject(UtilService);
  metadataStore = inject(MetadataStoreService);

  form = this.#formBuilder.group({
    id: [''],
    title: ['', [Validators.required, Validators.minLength(5)]],
    body: ['', [Validators.required]],
    music_preview: [''],
    source_url: [''],
    thumbnail: ['graphic_eq'],
    slug: [''],
    owner_id: [0],
    owner_username: [''],
    type_stage: [ETypeStage.FLOORSTAGE],
    metadata: [''],
    status: [EStatusPost.PUBLISHED],
    parent_id: [null],
    tags:[[]]
  });
  ctrlTags = this.form.get('tags') as FormControl;
  ctrlMusicPreview = this.form.get('music_preview') as FormControl;
  musicPreview = signal('');

  user: IUser | undefined;
  EPermission = EPermission;

  constructor(){
    effect(() => {
      if(this.#userStore.currentState()){
        this.user = this.#userStore.currentState();
        this.populeUserInForm(this.user);
      }
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
    if(!currentPost){return}
    this.form.patchValue({...currentPost});
    this.musicPreview.set(this.ctrlMusicPreview.value);
  }

  checkTags(tag: string){
    const tags = this.ctrlTags.value as string[]
    return tags.includes(tag)

  }

  populeUserInForm(user: IUser | undefined){
    if(!user){return}
    this.form.patchValue({
      owner_id: +user.id,
      owner_username: user.displayName,
    })

  }


  async save(){
    if(!this.form.value.title){return}
    const slug = this.createSlug(this.form.value.title)
    const tags = JSON.stringify(this.ctrlTags.value)
    const post = {...this.form.value, slug, tags} as Partial<IPost>;
    let request$: Observable<IResponse>;
    if(post.id){
      request$ = this.#postStore.editOneApi(post);
    }else{
      request$ = this.#postStore.setOneApi(post);
    }

    const {error, results, message} = await firstValueFrom(request$);
    this.utils.showMsg(message)
    if(error){
      return
    }

    this.#router.navigate([`/posts/type/${post.type_stage}/${slug}`])
  }

  addTag(tag: any){
    const tags = this.ctrlTags.value as any[];
    if(!tags.length){
      tags.push(tag)
    }else{
      let index = tags.findIndex(elem => elem === tag);
      (index === -1) ? tags.push(tag) : tags.splice(index, 1)
    }

    this.ctrlTags.setValue(tags);
  }

  createSlug(title: string) {
    const slug = title
        .toLowerCase() // Converte para minúsculas
        .normalize("NFD") // Normaliza caracteres especiais
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres não alfanuméricos
        .trim() // Remove espaços no início e no fim
        .replace(/\s+/g, "-"); // Substitui espaços por '-'

    // Retorna o slug com a data formatada corretamente
    return `${slug}-${Date.now()}`;
  }

  openPreviewEditor(){
    const dialogRef = this.#dialog.open(PreviewEditorComponent, {disableClose: true,  minWidth: '50dvw', minHeight: '70dvh'});
    dialogRef.afterClosed().subscribe(results => {
      if(!results){return}
      const {music_preview} = results;
      this.ctrlMusicPreview.setValue(music_preview ?? '');
      this.musicPreview.set(this.ctrlMusicPreview.value);
    });
  }

  disabledOptsStage(stage: any){
    return (stage === ETypeStage.MAINSTAGE && !this.user?.plan?.valid)

  }

  openADBanner(){
    const dialogRef = this.#dialog.open(AdBannerComponent, {minWidth: '50dvw'});
    dialogRef.afterClosed().subscribe(results => {
      if(!results){return}
    });
  }


}
