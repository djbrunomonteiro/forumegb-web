import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, effect, ElementRef, inject, Input, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import WaveSurfer from 'wavesurfer.js';
import { UploadService } from '../../../services/upload.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    NgClass,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent implements OnDestroy {

  @Input() musicPreview = signal('');

  #platformId = inject(PLATFORM_ID);
  #upload = inject(UploadService);
  #el = inject(ElementRef);
  loadedLocale = signal(false);
  wavesurfer!: WaveSurfer;

  constructor(){
    effect(() => {
      if(this.musicPreview()){
        this.loadPreviewLocale()
      }
    })
  }


  async loadPreviewLocale() {
    if(!isPlatformBrowser(this.#platformId) || !this.musicPreview()){return}
    const blob = await firstValueFrom(this.#upload.getPreview(this.musicPreview())) as any
    const waveform = this.#el.nativeElement.querySelector('#waveform');
    if(!waveform){return}
 
    this.wavesurfer = WaveSurfer.create({
      container: waveform,
      waveColor: '#35e001',
      progressColor: '#383351',
      backend: 'WebAudio',
    });

    this.wavesurfer.loadBlob(blob);
    this.loadedLocale.set(true);
  }

  ngOnDestroy(): void {
    if(!this.wavesurfer){return}
    this.wavesurfer.destroy();
  }

}
