import { Component, OnInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { WorldBankService } from '../world-bank.service';
import { Country } from '../country';
import { PathData } from '../path-data';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})

export class MapComponent implements OnInit {
  title = 'World Map';
  emptyCountry = {
    name: '',
    capitalCity: '',
    incomeLevel: {
      '': ''
    },
    region: {
      '': ''
    },
    latitude: '',
    longitude: ''
  };
  countryInfo: Country = this.emptyCountry;
  paths: PathData[] = [];

  constructor(
    private worldBankService: WorldBankService,
    private changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient,
    private renderer2: Renderer2
  ) { }

  ngOnInit() {
    this.http.get('../../assets/map-image.svg', { responseType: 'text' })
      .subscribe((svgContent) => {
        let parser = new DOMParser();
        let svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        let pathElements = svgDoc.querySelectorAll('path');

        pathElements.forEach((path: SVGPathElement) => {
          this.paths.push({
            id: path.getAttribute('id'),
            d: path.getAttribute('d'),
            name: path.getAttribute('name')
          });
        });
      });
  }

  onCountryMouseOver(target: any) {
    this.renderer2.setStyle(target, 'fill', '#fc9c3a');
    this.worldBankService.getCountryInfo(target.id).subscribe((response: any) => {
      // Info about the response is in response[0] and response[1] is an Array
      this.countryInfo = response[1][0];
      this.changeDetectorRef.detectChanges();
    });
  }

  onCountryMouseLeave(target: any) {
    this.renderer2.setStyle(target, 'fill', "#92c842");
    this.countryInfo = this.emptyCountry;
    this.changeDetectorRef.detectChanges();
  }
}
