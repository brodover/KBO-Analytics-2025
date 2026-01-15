import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { PlayerDataService } from '../services/player-data-service';
import { ScoutingData } from '../interfaces/pitching';

Chart.register(...registerables);

@Component({
  selector: 'app-player-dashboard',
  imports: [CommonModule],
  templateUrl: './player-dashboard.html',
  styleUrl: './player-dashboard.css',
  standalone: true
})
export class PlayerDashboard implements OnInit {
  @ViewChild('radarCanvas') set canvas(content: ElementRef | undefined) {
    if (content) {
      this.radarCanvasElement = content;
      // We use a tiny timeout to ensure the CSS has actually been applied 
      // to the box before Chart.js tries to calculate the size.
      setTimeout(() => {
        this.initRadarChart();
      }, 0);
    }
  }
  private radarCanvasElement?: ElementRef;
  radarChart: any;

  allData: ScoutingData | null = null;
  playerNames: string[] = [];
  selectedPlayer: string = '';
  selectedYear: string = 'Career';
  availableYears: string[] = [];
  currentYearData: any = null;

  constructor(private dataService: PlayerDataService) { }

  ngOnInit() {
    this.dataService.getScoutingData().subscribe((data: ScoutingData) => {
      this.allData = data;
      this.playerNames = Object.keys(data).sort();
      // Default to first player in list
      this.onPlayerSelect(this.playerNames[0]);
    });
  }

  onPlayerSelect(name: string) {
    if (!this.allData) return;
    this.selectedPlayer = name;
    this.availableYears = Object.keys(this.allData[name]);
    // Default to Career, or the first available year
    this.selectedYear = this.availableYears.includes('Career') ? 'Career' : this.availableYears[0];
    this.updateDisplay();
  }

  onYearSelect(year: string) {
    this.selectedYear = year;
    this.updateDisplay();
  }

  updateDisplay() {
    if (!this.allData) return;
    this.currentYearData = this.allData[this.selectedPlayer][this.selectedYear];

    // If the chart already exists, just update the data (smoother animation)
    if (this.radarChart) {
      this.updateRadarChart();
    }
    // If chart doesn't exist, the @ViewChild setter will handle it automatically
  }

  // Helper to get consistent data points for both init and update
  private getRadarDataPoints() {
    const m = this.currentYearData.metrics;
    return [
      m.decision_percentile || (m.decision_score * 100), // Use percentile if available
      m.swing_rate * 100,
      (1 - m.trap_swing_rate) * 100, // Trap Avoidance
      m.contact_percentile || 75,     // Placeholder/Metric
      80                              // Placeholder for Zone Awareness
    ];
  }

  updateRadarChart() {
    if (this.radarChart) {
      this.radarChart.data.datasets[0].data = this.getRadarDataPoints();
      this.radarChart.data.datasets[0].label = `${this.selectedPlayer} (${this.selectedYear})`;
      this.radarChart.update();
    }
  }

  initRadarChart() {
  // 1. Force a clean slate. If there is an old chart object, 
  // it's likely connected to a dead canvas. Kill it.
  if (this.radarChart) {
    this.radarChart.destroy();
    this.radarChart = null; 
  }

  if (!this.radarCanvasElement) return;

  const ctx = this.radarCanvasElement.nativeElement.getContext('2d');
  
  // 2. Create the chart
  this.radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Decision', 'Aggression', 'Trap Avoidance', 'Contact', 'Zone Awareness'],
      datasets: [{
        label: `${this.selectedPlayer} (${this.selectedYear})`,
        data: this.getRadarDataPoints(),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(75, 192, 192)',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // This is key for the "black box" issue
      scales: {
        r: {
          min: 0,
          max: 100,
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
          ticks: { display: true, backdropColor: 'transparent', color: '#888' },
          pointLabels: { color: '#fff', font: { size: 12 } }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

  getHeatmapColor(countKey: string): string {
    const countData = this.currentYearData?.count_discipline?.[countKey];
    if (!countData || countData.sample < 5) return '#222';

    const diff = countData.diff;
    const hue = diff > 0 ? 120 : 0;
    // Increased sensitivity (2000) to make tiny decision score gaps visible
    const saturation = Math.min(Math.abs(diff) * 2000, 100);

    return `hsl(${hue}, ${saturation}%, 40%)`;
  }
}