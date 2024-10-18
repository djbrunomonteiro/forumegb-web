import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DropzoneCdkModule,
  FileInputValidators,
  FileInputValue,
} from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../services/upload.service';
import { firstValueFrom } from 'rxjs';
import { WaveFile } from 'wavefile';
import * as lamejs from 'lamejs'; 
import { UtilService } from '../../../services/util.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-preview-editor',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    DropzoneCdkModule,
    DropzoneMaterialModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './preview-editor.component.html',
  styleUrl: './preview-editor.component.scss',
})
export class PreviewEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('waveform', { static: false }) waveform!: ElementRef;
  
  #uploadService = inject(UploadService);
  #dialogRef = inject(MatDialogRef<PreviewEditorComponent>);
  #utils = inject(UtilService);

  wavesurfer!: WaveSurfer;
  regions = RegionsPlugin.create();
  loadedLocale = signal(false);
  loading = signal(false);

  validators = [FileInputValidators.accept('.mp3,audio/mp3')];
  ctrlFile = new FormControl<FileInputValue>(null, this.validators);

  regionSelect =  {
    start: 0,
    end: 30
  }

  originalAudioBuffer: any;

  
  ngOnInit(): void {}

  ngAfterViewInit() {
    this.wavesurfer = WaveSurfer.create({
      container: this.waveform.nativeElement,
      waveColor: '#35e001',
      progressColor: '#383351',
      backend: 'WebAudio',
      plugins: [this.regions],
    });

    this.ctrlFile.valueChanges.subscribe((file) => {
      if (!file) {
        return;
      }
      this.loadPreviewLocale(file as File);
    });
  }

  loadPreviewLocale(file: File) {
    if (!this.wavesurfer || !file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      // Certifica-se de que estamos convertendo o resultado em Blob corretamente
      const arrayBuffer = reader.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type }); // Converter para Blob
      this.wavesurfer.loadBlob(blob);
      this.createDragRegion();
      this.originalAudioBuffer = file;
      this.loadedLocale.set(true);
    };

    reader.onerror = (error) => {
      console.error('Erro ao ler o arquivo:', error);
    };

    reader.readAsArrayBuffer(file);
  }

  createDragRegion() {
    const {start, end} = this.regionSelect;
    
    this.wavesurfer.on('decode', () => {
      this.regions.addRegion({
        start, 
        end,
        content: '< Mova >',
        color: '#38335149',
        resize: false,
      });
    });

    this.listenRegion();
  }

  listenRegion() {
    if (!this.regions) { return; }
    // Ouça o evento de atualização da região
    this.regions.on('region-updated', (region) => {
      const {start, end} = region;
      this.regionSelect = {start, end};
    });
  }
  
  async save() {
    // Verificar se o wavesurfer está disponível
    if (!this.wavesurfer) return;
    const {start, end} = this.regionSelect;
    this.loading.set(true)
    const {error, results, message} = await firstValueFrom(this.#uploadService.savePreview(this.originalAudioBuffer, start, end))
    this.loading.set(false);
    this.#utils.showMsg(message);
    if(error){
      return
    }

    this.#dialogRef.close(results)
 

  }
  

  

}