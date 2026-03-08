import { Component, OnInit, ElementRef, ViewChild, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import embed from 'vega-embed';
import { isPlatformBrowser } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-pitch-move',
  imports: [CommonModule, FormsModule],
  templateUrl: './pitch-move.html',
  styleUrl: './pitch-move.css'
})
export class PitchMove implements AfterViewInit {
  @ViewChild('chartLeft', { static: true }) chartLeft!: ElementRef;
  @ViewChild('chartRight', { static: true }) chartRight!: ElementRef;

  // Options for dropdowns
  years = ['2023', '2024', '2025'];
  teams = [
    { code: 'HH', name: 'Hanwha Eagles' },
    { code: 'LT', name: 'Lotte Giants' },
    { code: 'SS', name: 'Samsung Lions' },
    { code: 'OB', name: 'Doosan Bears' },
    { code: 'LG', name: 'LG Twins' },
    { code: 'NC', name: 'NC Dinos' },
    { code: 'HT', name: 'KIA Tigers' },
    { code: 'KT', name: 'KT Wiz' },
    { code: 'SSG', name: 'SSG Landers' },
    { code: 'WO', name: 'Kiwoom Heroes' }
  ];
  
  // Independent states for Left and Right
  leftConfig = { year: '2025', team: 'HH' };
  rightConfig = { year: '2025', team: 'LT' };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Small timeout ensures the browser has finished the layout "paint"
      setTimeout(() => {
        this.updateLeft();
        this.updateRight();
      }, 0);
    }
  }

  async updateLeft() {
    this.renderSide(this.chartLeft.nativeElement, this.leftConfig);
  }

  async updateRight() {
    this.renderSide(this.chartRight.nativeElement, this.rightConfig);
  }
  
private async renderSide(element: HTMLElement, config: { year: string, team: string }) {
    if (!element) return;

    const specUrl = `assets/pitch_move/${config.year}/${config.team}.json`;
    
    try {
      await embed(element, specUrl, {
        actions: false,
        renderer: 'svg',
        width: 650, 
        height: 650,
        patch: (spec) => {
          // This is the magic line: it forces the chart to fit the 
          // dimensions inclusive of axes and legends.
          spec.autosize = { type: 'fit', contains: 'padding' };
          return spec;
        }
      });
    } catch (error) {
      console.error(`Error loading side:`, error);
    }
  }
}