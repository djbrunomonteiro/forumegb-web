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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { CountComentPipe } from '../../../pipes/count-coment.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ETypeStage, EPermission } from '../../../enums/enums';
import { IPost } from '../../../interfaces/posts';
import { AdBannerComponent } from '../../shared/ad-banner/ad-banner.component';
import { UserStoreService } from '../../../store/user-store.service';

@Component({
  selector: 'app-home',
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
    NgClass


  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  #dialog = inject(MatDialog);
  router = inject(Router);
  postStore = inject(PostsStoreService);
  userStore = inject(UserStoreService);
  metadataStore = inject(MetadataStoreService)
  utils = inject(UtilService);

  constructor(){
    const title = 'EGB HUB - Fórum de Música Eletrônica Cristã | Gospel Remixes';
    const description = 'Fórum EGBhuB - Conecte-se com uma comunidade apaixonada por música eletrônica cristã! Compartilhe tracks, colabore com artistas e descubra beats inspiradores cheios de fé.';
    this.utils.setTitleDesc(title, description);
    this.utils.setTags([
      { name: 'description', content: 'Fórum EGBhuB - Conecte-se com uma comunidade apaixonada por música eletrônica cristã! Compartilhe tracks, colabore com artistas e descubra beats inspiradores cheios de fé.' },
      { name: 'keywords', content: 'música eletrônica cristã, EGBHUB, beats cristãos, fórum de música cristã, DJ gospel, remixes cristãos, comunidade de música eletrônica, música gospel eletrônica, tracks cristãs, produção musical gospel, colaboração musical cristã, eventos de música eletrônica cristã, setlists gospel, música e fé' },
      { name: 'author', content: 'EGBhuB' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { property: 'og:title', content: 'EGBhuB - Página Inicial' },
      { property: 'og:description', content: 'Uma descrição otimizada para redes sociais usando Angular.' },
      { property: 'og:image', content: 'https://egbhub.com.br/info-egbhub-home.jpg' },
      { property: 'og:url', content: 'https://egbhub.com.br' }
    ])
  }

  async ngOnInit(): Promise<void> {
    await firstValueFrom(this.postStore.getHome())
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

}
