import { Component, inject, OnInit } from '@angular/core';
import { PostsStoreService } from '../../../store/posts-store.service';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MetadataStoreService } from '../../../store/metadata-store.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    AsyncPipe,
    MatProgressBarModule
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {

  postStore = inject(PostsStoreService);
  metadata = inject(MetadataStoreService);
  loading = false


  ngOnInit(): void {
    this.initStates();
    
  }

  async initStates(){
    this.loading = true
    const res = await firstValueFrom(this.postStore.getAllAPI());
    console.log(res);
    this.loading = false
    

  }



}
