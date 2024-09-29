import { Component, inject, Input } from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { IPost } from '../../../interfaces/posts';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';


@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule, 
    MatInputModule,
    QuillEditorComponent
  ],
  templateUrl: './post-editor.component.html',
  styleUrl: './post-editor.component.scss'
})
export class PostEditorComponent {

  #formBuilder = inject(FormBuilder);

  form = this.#formBuilder.group({
    id: [''],
    title: ['', [Validators.required, Validators.minLength(5)]],
    body: ['', [Validators.required, Validators.minLength(15)]],
    music_preview: [''],
    source_url: [''],
    thumbnail: [''],
    slug: [''],
    owner_id: [''],
    owner_username: [''],
    metadata: [''],
    status: [''],
    parent_id: [''],
  })


}
