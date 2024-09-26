import { Component, Input } from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { IPost } from '../../../interfaces/posts';
@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './post-editor.component.html',
  styleUrl: './post-editor.component.scss'
})
export class PostEditorComponent {

  @Input({required: true}) post!: IPost;

}
