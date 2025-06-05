import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { PostsStoreService } from './../../../store/posts-store.service';
import { Component, effect, inject, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { MetadataStoreService } from '../../../store/metadata-store.service';
import { Router, RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SyncDatePipe } from '../../../pipes/sync-date.pipe';
import { AsyncPipe, TitleCasePipe, DatePipe, NgStyle, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { CountComentPipe } from '../../../pipes/count-coment.pipe';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IPost } from '../../../interfaces/posts';
import { AdBannerComponent } from '../../shared/ad-banner/ad-banner.component';
import { UserStoreService } from '../../../store/user-store.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { PreviewComponent } from '../../shared/preview/preview.component';
import { ConvertSignalPipe } from '../../../pipes/convert-signal.pipe';
import { StageComponent } from '../stage/stage.component';
import { CommentEditorComponent } from '../../shared/comment-editor/comment-editor.component';
import { SearchComponent } from '../../shared/search/search.component';
import { PostComponent } from '../post/post.component';
import { PostModalComponent } from '../../shared/post-modal/post-modal.component';
import { CadastroComponent } from '../sigin-register/cadastro.component';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-home',
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
        NgClass,
        PreviewComponent,
        ConvertSignalPipe,
        StageComponent,
        CommentEditorComponent,
        PreviewComponent,
        SearchComponent,
        PostComponent,
        MatDialogModule,

    ],
    providers: [
      DatePipe
  ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  #dialog = inject(MatDialog);
  analytics = inject(AnalyticsService);
  router = inject(Router);
  postStore = inject(PostsStoreService);
  userStore = inject(UserStoreService);
  metadataStore = inject(MetadataStoreService);
  dialog = inject(MatDialog);
  utils = inject(UtilService);
  datePipe = inject(DatePipe);

  posts: IPost[] = [];
  start = 0;
  limit = 25;

  constructor(){
    const title = 'EGB HUB - Fórum de Música Eletrônica Cristã | Gospel Remixes';
    const description = 'Fórum EGBhuB - Conecte-se com uma comunidade apaixonada por música eletrônica cristã! Compartilhe tracks, colabore com artistas e descubra beats inspiradores cheios de fé.';
    this.utils.setTitleDesc(title, description);
    this.utils.setTags([
      { name: 'description', content: 'Fórum EGBhuB - Conecte-se com uma comunidade apaixonada por música eletrônica cristã! Compartilhe tracks, colabore com artistas e descubra beats inspiradores cheios de fé.' },
      { name: 'keywords', content: 'música eletrônica cristã, EGBHUB, beats cristãos, fórum de música cristã, DJ gospel, remixes cristãos, comunidade de música eletrônica, música gospel eletrônica, tracks cristãs, produção musical gospel, colaboração musical cristã, eventos de música eletrônica cristã, setlists gospel, música e fé' },
      { name: 'author', content: 'EGBhuB' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { property: 'og:title', content: 'EGB huB- Fórum de Música Eletrônica Cristã' },
      { property: 'og:description', content: 'Conecte-se com uma comunidade apaixonada por música eletrônica cristã!' },
      { property: 'og:image', content: 'https://egbhub.com.br/info-egbhub-home.jpg' },
      { property: 'og:url', content: 'https://egbhub.com.br' }
    ]);

    effect(() => {
      if(this.postStore.select.state()){
        this.posts = this.postStore.select.resume(this.start, this.limit)() as IPost[]
      }
    })
  }

  async ngOnInit(): Promise<void> {
    await this.postStore.getRecordTotal();
    await this.postStore.actionLoadHome();

  }

  async selectPost(post:IPost){
    this.postStore.setCurrentPost(post.slug);
    const title = `EGB HUB - Post: ${this.postStore.select.current()?.title} `;
    const description = `Postagem de ${this.postStore.select.current()?.owner_username} em ${this.datePipe.transform(this.postStore.select.current()?.created_at, 'short') } no Fórum EGB HUB`;
    this.utils.setTitleDesc(title, description);
    this.analytics.setLog('view_page', {name: this.postStore.select.current()?.slug});

    this.openDialog()
  }

  openDialog() {
    const dialogRef = this.dialog.open(
      PostModalComponent,{
        width: '100vw',
        height: '100vh',
      }
    );
  }

  async handlePageEvent(e: PageEvent) {
    this.start = e.pageIndex * 25;
    await this.postStore.actionLoadHome(this.start, this.limit);
    this.posts = this.postStore.select.resume(this.start, this.limit)() as IPost[];

  }


}
