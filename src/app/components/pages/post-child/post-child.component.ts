import { Component, Input } from '@angular/core';
import { IPost } from '../../../interfaces/posts';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-post-child',
  standalone: true,
  imports: [
    TitleCasePipe,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './post-child.component.html',
  styleUrl: './post-child.component.scss'
})
export class PostChildComponent {
  @Input({required: true}) post!: IPost;

}
