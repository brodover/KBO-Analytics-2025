import { Component, OnInit, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
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
export class PitchMove implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

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
  
  selectedYear = '2025';
  selectedTeam = 'LT';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderChart();
    }
  }

  async renderChart() {
    // Path matches your Python output: assets/movement_profile/YEAR/TEAM.json
    const specUrl = `assets/pitch_move/${this.selectedYear}/${this.selectedTeam}.json`;

    try {
      await embed(this.chartContainer.nativeElement, specUrl, {
        actions: false, // Hides the Vega export menu for a cleaner look
        renderer: 'svg', // SVG is crisper for scatter plots
        // 'container' tells the chart to fill its parent <div>
        width: 600,  // You can keep a fixed pixel value
        height: 600, // Or use 'container' if your CSS defines a size
      });
    } catch (error) {
      console.error('Error loading the movement profile:', error);
    }
  }

  // Triggered by (change) in HTML
  onFilterChange() {
    this.renderChart();
  }
}