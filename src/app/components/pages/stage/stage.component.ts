import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { IPost } from '../../../interfaces/posts';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {MatPaginatorModule} from '@angular/material/paginator';
import { UtilService } from '../../../services/util.service';
import { MetadataStoreService } from '../../../store/metadata-store.service';
import { PostsStoreService } from '../../../store/posts-store.service';
import { ETypeStage } from '../../../enums/enums';
import { firstValueFrom } from 'rxjs';
import { CountComentPipe } from '../../../pipes/count-coment.pipe';
import { SyncDatePipe } from '../../../pipes/sync-date.pipe';


@Component({
  selector: 'app-stage',
  standalone: true,
  imports: [
    AsyncPipe,
    TitleCasePipe,
    MatProgressBarModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatCardModule,
    MatPaginatorModule,
    MatRadioModule,
    CountComentPipe,
    DatePipe,
    SyncDatePipe
  ],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss'
})
export class StageComponent implements OnInit {

  @Input() type: string = '';
  @Input() isHome = false;

  activatedRoute = inject(ActivatedRoute);
  postStore = inject(PostsStoreService);
  metadata = inject(MetadataStoreService);
  utils = inject(UtilService);

  postsStage = signal<IPost[]>([]);
  limit = 30;


  stageOpt = {
    value: '',
    title: '',
    description: ''
  };

  ngOnInit(): void {
    this.type = this.isHome ? this.type : this.activatedRoute.snapshot.paramMap.get('type') ?? ETypeStage.FLOORSTAGE;
    if(!this.type){return}
    this.stageOpt = this.utils.stageOpts.filter(elem => elem.value === this.type)[0];
    this.getPosts(this.stageOpt.value)
    console.log(this.stageOpt);

  }

  async getPosts(type: string, start = this.postsStage().length, limit = this.limit, order = 'recentes'){
    await firstValueFrom(this.postStore.getAllAPI(type, start, limit));
    this.setOrderStage(order);
  }


  async setOrderStage(value: string = 'recentes'){
    if(!this.stageOpt?.value){return}
    let currentsPosts: IPost[] = [];
    let postsOrders: IPost[] = [];

    if(value === 'relevantes'){
      const start = this.postsStage().filter(elem => elem.likes?.length).length
      await firstValueFrom(this.postStore.getAllAPI(this.stageOpt.value, start, this.limit));
    }
    
    switch(this.stageOpt.value){
      case ETypeStage.MAINSTAGE:
        currentsPosts = this.postStore.mainStageState();
        postsOrders = value === 'relevantes' ? this.utils.sortByLikes(currentsPosts) : this.utils.sortArrayByKey(currentsPosts, 'id', 'desc');
        break;
      case ETypeStage.FLOORSTAGE:
        currentsPosts = this.postStore.floorStageState();
        postsOrders = value === 'relevantes' ? this.utils.sortByLikes(currentsPosts) : this.utils.sortArrayByKey(currentsPosts, 'id', 'desc');
        break;
      default:
        currentsPosts = this.postStore.backStageState();
        postsOrders = value === 'relevantes' ? this.utils.sortByLikes(currentsPosts) : this.utils.sortArrayByKey(currentsPosts, 'id', 'desc');
        break;
    }

    if(this.isHome){
      postsOrders = postsOrders.filter((_, i) => i < 10)
    }

    this.postsStage.set(postsOrders)

 
  }

}
