import { Component, effect, inject, OnInit, signal, Signal } from '@angular/core';
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
@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
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
export class PostComponent implements OnInit {

  #activatedRoute = inject(ActivatedRoute);
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

  constructor(){
  }
  ngOnInit(): void {
    this.setCurrentPost();
  }

  async setCurrentPost(){
    const slug = this.#activatedRoute.snapshot.paramMap.get('slug') ?? undefined;
    await this.postStore.setCurrentPost(slug);
  }

  async save(){
    const postFather = this.postStore.currentPost();
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
