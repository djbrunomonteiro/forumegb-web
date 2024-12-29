import { UserStoreService } from './../../../store/user-store.service';
import { Component, inject, Input, OnDestroy, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { IPost } from '../../../interfaces/posts';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, DatePipe, isPlatformBrowser, NgStyle, TitleCasePipe } from '@angular/common';
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
import { ETypeStage } from '../../../enums/enums';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { CountComentPipe } from '../../../pipes/count-coment.pipe';
import { SyncDatePipe } from '../../../pipes/sync-date.pipe';
import { MatDialog } from '@angular/material/dialog';
import { AdBannerComponent } from '../../shared/ad-banner/ad-banner.component';
import {MatTableModule} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MenuSideComponent } from '../../shared/menu-side/menu-side.component';
import { AnalyticsService } from '../../../services/analytics.service';
import { ConvertSignalPipe } from '../../../pipes/convert-signal.pipe';
import { PreviewComponent } from '../../shared/preview/preview.component';


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
    FormsModule,
    MenuSideComponent,
    PreviewComponent,
    ConvertSignalPipe
  ],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss'
})
export class StageComponent implements OnDestroy {

  @ViewChild('paginator', { static: true }) paginator: any;

  @Input() type: string = '';
  @Input() isHome = false;

  #dialog = inject(MatDialog);
  #platformId = inject(PLATFORM_ID);
  activatedRoute = inject(ActivatedRoute);
  postStore = inject(PostsStoreService);
  userStore = inject(UserStoreService);
  router = inject(Router);
  metadata = inject(MetadataStoreService);
  utils = inject(UtilService);
  analytics = inject(AnalyticsService);
  
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

  unsub$ = new Subject();

  constructor(){
    this.listenNavState()
  }

  setViewPosts(){
    this.type = this.isHome ? this.type : this.activatedRoute.snapshot.paramMap.get('type') ?? ETypeStage.FLOORSTAGE;
    if(!this.type){return};

    const title = `EGB HUB - Seção ${this.type} `;
    const description = `Lista de postagens com Músicas, Remixes, Sets, Djs de Eletrônica Cristã | Gospel`;
    this.utils.setTitleDesc(title, description);
    this.analytics.setLog('view_page', {name: this.type});
    
    let paginationData = {pageIndex: 0, pageSize: this.pageSize}

    if(isPlatformBrowser(this.#platformId)){
      const getPaginationStogare = localStorage.getItem(`mat-pagination-${this.type}`);
      if(getPaginationStogare){
        paginationData = JSON.parse(getPaginationStogare);
      }
    }

    this.stageOpt = this.utils.stageOpts.filter(elem => elem.value === this.type)[0];
    this.postStore.getRecordTotal(this.stageOpt.value as ETypeStage);

    const containInBck = this.postStore.backupState().filter(bckp => bckp.type === this.stageOpt.value);

    if(containInBck.length){
      const last = containInBck[containInBck.length - 1];
      paginationData = {pageIndex: last?.pageIndex ?? 0, pageSize: this.pageSize} 
    }

    this.controlPage(paginationData);
  }

  listenNavState(){
    this.utils.navState$.pipe(takeUntil(this.unsub$)).subscribe((nav) => {
      const url = this.utils.currentNavState()?.url;
      if(!url){return}

      this.setViewPosts()

      // this.ngOnInit();
    })
  }

  async controlPage(pagination: any){

    
    const {pageIndex, pageSize} = pagination;
    this.pageStart = pageIndex * pageSize;
    if(this.paginator){
      this.paginator.pageIndex = pageIndex;
    }

    if(isPlatformBrowser(this.#platformId)){
      localStorage.setItem(`mat-pagination-${this.type}`, JSON.stringify({...pagination, type: this.type}))
    }


    await this.getPosts(this.stageOpt.value, this.pageStart, this.pageSize, pageIndex)
  }

  async getPosts(type: string, start = this.pageStart, limit = this.pageSize, pageIndex = 0, order = 'recentes'){
    await firstValueFrom(this.postStore.getAllAPI(type, start, limit, pageIndex));
  }


  openPost(post:IPost | undefined){
    if(!post){return}

    const user = this.userStore.currentState();
    if(!user){
      const url = `posts/type/${post.type_stage}/${post.slug}`;
      this.router.navigate(['/login-cadastro'], {queryParams: {redirect:url}})
      return
    }

    const {slug, type_stage} = post;
    if(type_stage === ETypeStage.MAINSTAGE && user?.plan?.valid){
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

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
  }


}
