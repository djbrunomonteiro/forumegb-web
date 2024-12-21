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
