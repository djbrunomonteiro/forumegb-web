import { UserStoreService } from './../../../store/user-store.service';
import { Component, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { IPost } from '../../../interfaces/posts';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, DatePipe, NgStyle, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {MatPaginatorModule} from '@angular/material/paginator';
import { UtilService } from '../../../services/util.service';
import { MetadataStoreService } from '../../../store/metadata-store.service';
import { PostsStoreService } from '../../../store/posts-store.service';
import { EPermission, ETypeStage } from '../../../enums/enums';
import { firstValueFrom } from 'rxjs';
import { CountComentPipe } from '../../../pipes/count-coment.pipe';
import { SyncDatePipe } from '../../../pipes/sync-date.pipe';
import { MatDialog } from '@angular/material/dialog';
import { AdBannerComponent } from '../../shared/ad-banner/ad-banner.component';
import {MatTableModule} from '@angular/material/table';
import { FormsModule } from '@angular/forms';


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
    SyncDatePipe,
    NgStyle,
    AdBannerComponent,
    MatTableModule,
    FormsModule
  ],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss'
})
export class StageComponent implements OnInit {

  @ViewChild('paginator', { static: true }) paginator: any;

  @Input() type: string = '';
  @Input() isHome = false;

  #dialog = inject(MatDialog)
  activatedRoute = inject(ActivatedRoute);
  postStore = inject(PostsStoreService);
  userStore = inject(UserStoreService);
  router = inject(Router);
  metadata = inject(MetadataStoreService);
  utils = inject(UtilService);
  

  postsStage = signal<IPost[]>([]);
  postsView = signal<IPost[]>([]);
  pageStart = 0;
  pageSize = 10;


  stageOpt = {
    value: '',
    access: '',
    title: '',
    img: '',
    description: '',
    color: ''
  };

  imgUrl = '';

  ngOnInit(): void {
    this.type = this.isHome ? this.type : this.activatedRoute.snapshot.paramMap.get('type') ?? ETypeStage.FLOORSTAGE;
    if(!this.type){return}

    

    this.stageOpt = this.utils.stageOpts.filter(elem => elem.value === this.type)[0];
    this.postStore.getRecordTotal(this.stageOpt.value as ETypeStage);

    const containInBck = this.postStore.backupState().filter(bckp => bckp.type === this.stageOpt.value);
    let pagination = {pageIndex: 0, pageSize: this.pageSize} 
    if(containInBck.length){
      const last = containInBck[containInBck.length - 1];
      this.paginator.pageIndex = last?.pageIndex ?? 0
      pagination = {pageIndex: last?.pageIndex ?? 0, pageSize: this.pageSize} 
    }

    this.controlPage(pagination);
  }

  async controlPage(pagination: any){
    const {pageIndex, pageSize} = pagination;
    this.pageStart = pageIndex * pageSize;

    console.log(this.pageStart);
    
    await this.getPosts(this.stageOpt.value, this.pageStart, this.pageSize, pageIndex)
  }

  async getPosts(type: string, start = this.pageStart, limit = this.pageSize, pageIndex = 0, order = 'recentes'){
    await firstValueFrom(this.postStore.getAllAPI(type, start, limit, pageIndex));
    // this.setOrderStage(order);
  }


  async setOrderStage(value: string = 'recentes'){
    // if(!this.stageOpt?.value){return}
    // let currentsPosts: IPost[] = [];
    // let postsOrders: IPost[] = [];

    // if(value === 'relevantes'){
    //   const start = this.postsStage().filter(elem => elem.likes?.length).length
    //   await firstValueFrom(this.postStore.getAllAPI(this.stageOpt.value, start, this.limit));
    // }
    
    // switch(this.stageOpt.value){
    //   case ETypeStage.MAINSTAGE:
    //     currentsPosts = this.postStore.mainStageState();
    //     postsOrders = value === 'relevantes' ? this.utils.sortByLikes(currentsPosts) : this.utils.sortArrayByKey(currentsPosts, 'id', 'desc');
    //     this.imgUrl = 'main.jpg'
    //     break;
    //   case ETypeStage.FLOORSTAGE:
    //     currentsPosts = this.postStore.floorStageState();
    //     postsOrders = value === 'relevantes' ? this.utils.sortByLikes(currentsPosts) : this.utils.sortArrayByKey(currentsPosts, 'id', 'desc');
    //     this.imgUrl = 'floor.jpg'
    //     break;
    //   default:
    //     currentsPosts = this.postStore.backStageState();
    //     postsOrders = value === 'relevantes' ? this.utils.sortByLikes(currentsPosts) : this.utils.sortArrayByKey(currentsPosts, 'id', 'desc');
    //     this.imgUrl = 'back.jpg'
    //     break;
    // }

    // if(this.isHome){
    //   postsOrders = postsOrders.filter((_, i) => i < 10)
    // }

    // this.postsStage.set(postsOrders)
  }

  openPost(post:IPost | undefined){
    if(!post){return}
    
    const user = this.userStore.currentState();
    if(!user){
      const url = `posts/type/${post.type_stage}/${post.slug}`;
      console.log(url);
      
      this.router.navigate(['/login-cadastro'], {state: {url}})
      return
    }

    const {slug, type_stage} = post;
    if(type_stage === ETypeStage.MAINSTAGE && user.permission !== EPermission.BASIC_DJ){
      this.router.navigate([`/posts/type/${type_stage}/${slug}`])
      return
    }

    if(type_stage !== ETypeStage.MAINSTAGE){
      this.router.navigate([`/posts/type/${type_stage}/${slug}`])
      return
    }

    this.openADBanner()

  }

  openADBanner(){
    const dialogRef = this.#dialog.open(AdBannerComponent, {minWidth: '50dvw'});
    dialogRef.afterClosed().subscribe(results => {
      if(!results){return}
    });
  }

}
