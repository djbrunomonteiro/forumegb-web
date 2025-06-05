import { afterRender, Component, effect, inject, Input, OnInit, PLATFORM_ID, Signal, signal } from '@angular/core';
import { IPost } from '../../../interfaces/posts';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilService } from '../../../services/util.service';
import { MetadataStoreService } from '../../../store/metadata-store.service';
import { QuillEditorComponent } from 'ngx-quill';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { UserStoreService } from '../../../store/user-store.service';
import { firstValueFrom } from 'rxjs';
import { PostsStoreService } from '../../../store/posts-store.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-comment-editor',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    QuillEditorComponent,
    MatProgressBarModule,
    MatButtonModule
  ],
  standalone: true,
  templateUrl: './comment-editor.component.html',
  styleUrl: './comment-editor.component.scss'
})
export class CommentEditorComponent implements OnInit {

  @Input() post!: IPost;

  formBuilder = inject(FormBuilder);
  utils = inject(UtilService);
  metadataStore = inject(MetadataStoreService);
  userStore = inject(UserStoreService);
  postStore = inject(PostsStoreService);
  platformId = inject(PLATFORM_ID);

  isBrowser = false;
  showQuill = false;


  form = this.formBuilder.group({
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
    parent_id: [0],
  });


  editor: any;

  customQuillModules = {
    toolbar: [
      ['link', 'image'],         // Botões de link e imagem
    ],
    resizeImage: {}
  };

  constructor(){

  }
  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async save(){
    const user = this.userStore.currentState();
    if(!user || !this.post){return}

    this.form.patchValue({
      parent_id: this.post.id,
      owner_id: user.id,
      owner_username: user?.displayName,
    });

    const comment = this.form.value as Partial<IPost>
    this.form.patchValue({body: ''})
    const {error, message} = await this.postStore.actionSaveOne(comment, this.post.id)
    if(error){
      this.form.patchValue({body: comment.body})
      this.utils.showMsg(message)
      return
    }
  }



}
