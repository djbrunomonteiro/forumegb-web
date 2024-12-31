import { MatInputModule } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { UtilService } from '../../../services/util.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, startWith, map, debounceTime } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  @Output()search = new EventEmitter<any>();

  utils = inject(UtilService);


  options = [
    "ALTERNATIVG",
    "Aviva Mix",
    "Bruno monteiro",
    "BrunoXD",
    "Diogo Venex",
    "DRADE BASS",
    "DJ AJ",
    "DJ ALBERY",
    "Dj Cicero",
    "DJ Kreatuz",
    "DJ KALIX",
    "DJ VICTOR AUGUSTO",
    "Dj Jonatas",
    "FIRESTONE",
    "FirstLove",
    "FQZ",
    "Frank Lima",
    "Gil Alterntiv",
    "GilsonAnd1",
    "Gospel experiences",
    "GUI BRAZIL",
    "GV3",
    "Isac Oliveira",
    "Joel LIFE",
    "Julian Cristopher",
    "Kento",
    "MATHEUS LAZARETI",
    "MKJS",
    "NEXUS DJ",
    "Nuckless",
    "Pv",
    "RAA-3",
    "ROB Sarah",
    "ROBERTO ROSSO",
    "Samuel Zamora",
    "VITOR CAPOIA",
    "YUUKI"
  ];

  myControl = new FormControl<string>('');
  filteredOptions!: Observable<string[]>;
  

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.listenFilter();
  }

  listenFilter(){
    this.myControl.valueChanges.pipe(debounceTime(2000)).subscribe(value => {
      this.search.emit(value);
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  clear(){
    this.myControl.setValue('')
  }
}

