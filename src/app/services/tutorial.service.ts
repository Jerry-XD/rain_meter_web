import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Tutorial } from '../models/tutorial.model';
import { RainLog } from '../models/tutorial.model';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  private dbPath = '/tutorials';
  private rainLogdbPath = '/rainmeter';

  tutorialsRef: AngularFireList<Tutorial>;
  rainLogRef: AngularFireList<RainLog>;


  constructor(private db: AngularFireDatabase) {
    this.tutorialsRef = db.list(this.dbPath);
    this.rainLogRef = db.list(this.rainLogdbPath);
  }

  getAll(): AngularFireList<Tutorial> {
    return this.tutorialsRef;
  }

  getAllRainLog(): AngularFireList<RainLog> {
    return this.rainLogRef;
  }

  create(tutorial: Tutorial): any {
    return this.tutorialsRef.push(tutorial);
  }

  update(key: string, value: any): Promise<void> {
    return this.tutorialsRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.tutorialsRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.tutorialsRef.remove();
  }
}
