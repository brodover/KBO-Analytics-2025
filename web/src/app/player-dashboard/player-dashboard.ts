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
  @ViewChild('radarCanvas') radarCanvas!: ElementRef;

  allData: ScoutingData | null = null;
  playerNames: string[] = [];
  selectedPlayer: string = '';
  selectedYear: string = 'Career';
  availableYears: string[] = [];
  
  // This resolves your TS2339 error
  currentYearData: any = null; 
  radarChart: any;
constructor(private dataService: PlayerDataService) {}

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
    this.updateRadarChart();
  }

  updateRadarChart() {
    const metrics = this.currentYearData.metrics;
    const dataPoints = [
      metrics.decision_score * 100,
      metrics.swing_rate * 100,
      (1 - metrics.trap_swing_rate) * 100, // Trap Avoidance
      75 // Placeholder for contact/execution
    ];

    if (this.radarChart) {
      this.radarChart.data.datasets[0].data = dataPoints;
      this.radarChart.update();
    } else {
      this.initRadarChart(dataPoints);
    }
  }

  initRadarChart(dataPoints: number[]) {
    setTimeout(() => {
      this.radarChart = new Chart(this.radarCanvas.nativeElement, {
        type: 'radar',
        data: {
          labels: ['Decision (Process)', 'Aggression', 'Trap Avoidance', 'Contact Skill'],
          datasets: [{
            label: `${this.selectedPlayer} (${this.selectedYear})`,
            data: dataPoints,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
          }]
        },
        options: {
          scales: { r: { min: 0, max: 100, ticks: { display: false } } }
        }
      });
    }, 100);
  }

  getHeatmapColor(score: number): string {
    if (score === undefined || score === null) return '#333';
    // Green for good decisions, Red for bad
    if (score > 0.70) return '#2ecc71'; 
    if (score > 0.45) return '#f1c40f'; 
    return '#e74c3c';
  }
}