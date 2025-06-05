import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PostsStoreService } from '../../../store/posts-store.service';
import { MatIconModule } from '@angular/material/icon';
import { PreviewComponent } from '../preview/preview.component';
import { CommentEditorComponent } from '../comment-editor/comment-editor.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { UserStoreService } from '../../../store/user-store.service';
import { IPost } from '../../../interfaces/posts';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CadastroComponent } from '../../pages/sigin-register/cadastro.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-post-modal',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    PreviewComponent,
    CommentEditorComponent,
    DatePipe,
    MatButtonModule,
    RouterLink,
    RouterModule,
    MatProgressBarModule,
    CadastroComponent
  ],
  providers: [
    DatePipe
],
  templateUrl: './post-modal.component.html',
  styleUrl: './post-modal.component.scss'
})
export class PostModalComponent implements OnInit  {

  postStore = inject(PostsStoreService);
  userStore = inject(UserStoreService);
  router = inject(Router);
  dialog = inject(MatDialog);
  #auth = inject(AuthService);
  #activatedRoute = inject(ActivatedRoute);
  datePipe = inject(DatePipe);

  musicPreview = signal('');

  constructor(){

  }
  async ngOnInit() {
    // this.#auth.logout();
    const isUser = this.userStore.currentState();


    if(this.postStore.select.current()){
      const {slug} = this.postStore.select.current() as IPost;
      const prev = this.postStore.select.current()?.music_preview as string
      this.musicPreview.set(prev);


       if(!isUser){
        await this.postStore.actionLoadOne(slug as string, 'summary');
      }else{
        this.postStore.actionLoadOne(slug as string)
      }
    }


  }

  openLoginRegister(){
    const dialogRef = this.dialog.open(
      CadastroComponent,{
        width: '100vw',
        height: '100vh',
      }
    );


    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openFull(slug: any){
    this.router.navigate(['/posts/remixes-gospel/', slug]);
    this.dialog.closeAll();

  }





}
