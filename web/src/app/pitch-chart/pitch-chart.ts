import { FormsModule } from '@angular/forms';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import embed from 'vega-embed';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-pitch-chart',
  imports: [FormsModule, CommonModule],
  templateUrl: './pitch-chart.html',
  styleUrl: './pitch-chart.css'
})
export class PitchChart implements OnInit {
  // State variables
  years: number[] = [2023, 2024, 2025];
  teams: string[] = ['HH', 'HT', 'KT', 'LG', 'LT', 'NC', 'OB', 'SK', 'SS', 'WO'];

  selectedYear: number = 2025;
  pitchingTeam: string = 'LT';
  battingTeam: string = 'HH';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inject the platform ID
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadMatchupData();
    }
  }

  // Build the dynamic path based on selection
  loadMatchupData(): void {
    const path = `assets/pitch_chart/${this.selectedYear}/${this.pitchingTeam}_vs_${this.battingTeam}.json`;

    this.http.get(path).subscribe({
      next: (spec: any) => {
        this.renderChart(spec);
      },
      error: (err) => {
        console.error('Matchup file not found:', path);
      }
    });
  }

  renderChart(spec: any): void {
    // vea-embed handles the Altair JSON perfectly
    if (isPlatformBrowser(this.platformId)) {
      embed('#vis', spec, { actions: false }).then(result => {
        // Access to the Vega view API if needed
      }).catch(console.error);
    }
  }

  // Triggered whenever a dropdown changes
  onSelectionChange(): void {
    this.loadMatchupData();
  }

  get filteredBattingTeams(): string[] {
    // Returns all teams EXCEPT the one currently pitching
    return this.teams.filter(t => t !== this.pitchingTeam);
  }
}
