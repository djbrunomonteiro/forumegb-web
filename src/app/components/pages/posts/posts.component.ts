import { ETypeStage } from './../../../enums/enums';
import { Component, effect, inject, Input, OnInit, signal } from '@angular/core';
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
import {MatCardModule} from '@angular/material/card';
import { UtilService } from '../../../services/util.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';


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
    RouterLink,
    MatCardModule,
    MatPaginatorModule,
    MatRadioModule
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {


  postStore = inject(PostsStoreService);
  metadata = inject(MetadataStoreService);
  utils = inject(UtilService);
  loading = false;

  mainStage = signal<IPost[]>([])
  floorStage  = signal<IPost[]>([])
  backStage  = signal<IPost[]>([])
  ETypeStage = ETypeStage;

  constructor(){
    effect(() => {
    })
  }


  ngOnInit(): void {
    this.initStates();
  }

  async initStates(){
    await firstValueFrom(this.postStore.getAllAPI());
    const initStages = [ETypeStage.MAINSTAGE, ETypeStage.FLOORSTAGE, ETypeStage.BACKSTAGE];
    initStages.forEach(stage => this.setOrderStage(stage))
  }

  setOrderStage(stage: ETypeStage = ETypeStage.MAINSTAGE, value = 'recentes'){
    let currentsPosts: IPost[] = [];
    let postsOrders: IPost[] = [];
    switch(stage){
      case ETypeStage.MAINSTAGE:
        currentsPosts = this.postStore.mainStageState();
        postsOrders = value === 'relevantes' ? this.utils.sortByLikes(currentsPosts) : this.utils.sortArrayByKey(currentsPosts, 'id', 'desc');
        postsOrders = postsOrders.filter((_, i) => i <= 9)
        this.mainStage.set(postsOrders);
        break;
      case ETypeStage.FLOORSTAGE:
        currentsPosts = this.postStore.floorStageState();
        postsOrders = value === 'relevantes' ? this.utils.sortByLikes(currentsPosts) : this.utils.sortArrayByKey(currentsPosts, 'id', 'desc');
        postsOrders = postsOrders.filter((_, i) => i <= 9)
        this.floorStage.set(postsOrders)
        break;
      default:
        currentsPosts = this.postStore.backStageState();
        postsOrders = value === 'relevantes' ? this.utils.sortByLikes(currentsPosts) : this.utils.sortArrayByKey(currentsPosts, 'id', 'desc');
        postsOrders = postsOrders.filter((_, i) => i <= 9)
        this.backStage.set(postsOrders);
        break;
    }

 
  }








}
