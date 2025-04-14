import { Component, effect, inject, Input, Signal, signal } from '@angular/core';
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
export class CommentEditorComponent {

  @Input() post!: IPost;

  formBuilder = inject(FormBuilder);
  utils = inject(UtilService);
  metadataStore = inject(MetadataStoreService);
  userStore = inject(UserStoreService);
  postStore = inject(PostsStoreService);


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




  async save(){
    const user = this.userStore.currentState();
    console.log(user, this.post)
    if(!user || !this.post){return}

    this.form.patchValue({
      parent_id: this.post.id,
      owner_id: user.id,
      owner_username: user?.displayName,
    });

    const comment = this.form.value as Partial<IPost>

    const {error, message} = await firstValueFrom(this.postStore.setOneApi(comment, this.post.id));
    if(error){
      this.utils.showMsg(message)
      return
    }

    this.form.patchValue({body: ''})
    console.log(this.form.value)

  }



}
