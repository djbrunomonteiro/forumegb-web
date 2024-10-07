import { Component, inject, Input, signal } from '@angular/core';
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

@Component({
  selector: 'app-post-child',
  standalone: true,
  imports: [
    TitleCasePipe,
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
  templateUrl: './post-child.component.html',
  styleUrl: './post-child.component.scss'
})
export class PostChildComponent {
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


  async save(){
    const postFather = this.post;
    const user = this.userStore.currentState();
    if(this.form.invalid || !postFather || !user){return}
    const newPost = {...this.form.value, parent_id: postFather.id, owner_id: user.id, owner_username: user.displayName} as Partial<IPost>
    const {error, message} = await firstValueFrom(this.postStore.setOneApi(newPost, postFather));
    this.#utils.showMsg(message)
    if(error){
      return
    }
    this.inEdition.set(false);
    this.form.patchValue({body:''});
  }

}
