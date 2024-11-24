import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { IPost } from '../../../interfaces/posts';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilService } from '../../../services/util.service';
import { MetadataStoreService } from '../../../store/metadata-store.service';
import { PostsStoreService } from '../../../store/posts-store.service';
import { UserStoreService } from '../../../store/user-store.service';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuillEditorComponent } from 'ngx-quill';
import { firstValueFrom } from 'rxjs';
import { SyncDatePipe } from '../../../pipes/sync-date.pipe';

@Component({
  selector: 'app-post-child',
  standalone: true,
  imports: [
    TitleCasePipe,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    QuillEditorComponent,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    SyncDatePipe
  ],
  templateUrl: './post-child.component.html',
  styleUrl: './post-child.component.scss'
})
export class PostChildComponent implements OnChanges {

  @Input({required: true}) post!: IPost;

  #formBuilder = inject(FormBuilder);
  #utils = inject(UtilService);
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
  

  inEdition = signal(false);
  loading = signal(false);

  count = signal(0);

  ngOnChanges(changes: SimpleChanges): void {
    this.post = this.#utils.paramsJsonParse(this.post) as IPost;
    const likes = this.post.likes ?? [];
    this.setCountLikes(likes)
  }


  async save(){
    
    const fatherPost = this.postStore.currentPost();
    const parentPost = this.post;
    const user = this.userStore.currentState();
    console.log(parentPost);
    if(this.form.invalid || !parentPost || !user){return}
    const newPost = {...this.form.value, type_stage: parentPost.type_stage, parent_id: parentPost.id, owner_id: user.id, owner_username: user.displayName} as Partial<IPost>
    const {error, message} = await firstValueFrom(this.postStore.setOneApi(newPost, fatherPost?.id));
    this.#utils.showMsg(message)
    if(error){
      return
    }
    this.inEdition.set(false);
    this.form.patchValue({body:''});
  }

  async saveLike(idPost: number | undefined | null){
    const idUser = this.userStore.currentState()?.id;
    if(idUser&& idPost){
      const {error, results} = await firstValueFrom(this.postStore.setLike(+idUser, +idPost));
      if(error){return}
      const likes = results?.likes as any[];
      this.setCountLikes(likes)
    }
  }

  async setCountLikes(likes: any[]){
    this.count.set(likes.length)
  }


}
