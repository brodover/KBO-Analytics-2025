import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScoutingData } from '../interfaces/pitching';

@Injectable({
  providedIn: 'root'
})
export class PlayerDataService {
  constructor(private http: HttpClient) {}

  // Ensure 'player_scouting_data.json' is in your src/assets folder
  getScoutingData(): Observable<any> {
    return this.http.get<ScoutingData>('assets/player_scouting_data.json');
  }
}
