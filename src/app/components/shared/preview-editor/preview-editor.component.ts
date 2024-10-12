import {
  AfterViewInit,
  Component,
  ElementRef,
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
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-preview-editor',
  standalone: true,
  imports: [
    MatFormFieldModule,
    DropzoneCdkModule,
    DropzoneMaterialModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './preview-editor.component.html',
  styleUrl: './preview-editor.component.scss',
})
export class PreviewEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('waveform', { static: false }) waveform!: ElementRef;
  wavesurfer!: WaveSurfer;
  regions = RegionsPlugin.create();
  loadedLocale = signal(false);

  validators = [FileInputValidators.accept('.mp3,audio/mp3')];
  ctrlFile = new FormControl<FileInputValue>(null, this.validators);

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

    console.log(this.wavesurfer, file);

    const reader = new FileReader();

    reader.onload = async () => {
      // Certifica-se de que estamos convertendo o resultado em Blob corretamente
      const arrayBuffer = reader.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type }); // Converter para Blob

      console.log('ArrayBuffer convertido para Blob:', blob);
      this.wavesurfer.loadBlob(blob);
      this.createDragRegion();

      this.loadedLocale.set(true);
    };

    reader.onerror = (error) => {
      console.error('Erro ao ler o arquivo:', error);
    };

    reader.readAsArrayBuffer(file);
  }

  createDragRegion() {
    this.wavesurfer.on('decode', () => {
      this.regions.addRegion({
        start: 0,
        end: 30,
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
      const start = region.start;
      const end = region.end;

    });
  }
}
