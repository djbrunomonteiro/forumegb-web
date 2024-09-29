import { Component, effect, inject, OnInit, signal, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostsStoreService } from '../../../store/posts-store.service';
import { IPost } from '../../../interfaces/posts';
import { PostChildComponent } from '../post-child/post-child.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    PostChildComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {

  #activatedRoute = inject(ActivatedRoute)
  postStore = inject(PostsStoreService);

  constructor(){
    effect(() => {
      console.log(this.postStore.currentPost());
      
    })
  }
  ngOnInit(): void {
    this.setCurrentPost();
  }

  setCurrentPost(){
    const slug = this.#activatedRoute.snapshot.paramMap.get('slug') ?? undefined;
    this.postStore.setCurrentPost(slug)
  }
}
