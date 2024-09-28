import { Component, effect, inject, Input, OnInit } from '@angular/core';
import { PostsStoreService } from '../../../store/posts-store.service';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MetadataStoreService } from '../../../store/metadata-store.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { PostEditorComponent } from '../post-editor/post-editor.component';
import { IPost } from '../../../interfaces/posts';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    AsyncPipe,
    TitleCasePipe,
    MatProgressBarModule,
    PostEditorComponent,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {


  postStore = inject(PostsStoreService);
  metadata = inject(MetadataStoreService);
  loading = false

  constructor(){
    effect(() => {
      console.log(this.postStore.currentState());
    })
  }


  ngOnInit(): void {
    this.initStates();

  }

  async initStates(){
    await firstValueFrom(this.postStore.getAllAPI());
  }



}
