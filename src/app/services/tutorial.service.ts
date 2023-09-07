import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Tutorial } from '../models/tutorial.model';
import { RainLog } from '../models/tutorial.model';
import { Temp } from '../models/tutorial.model';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  private dbPath = '/tutorials';
  private rainLogdbPath = '/rainmeter';
  private testPath = '/test';

  tutorialsRef: AngularFireList<Tutorial>;
  rainLogRef: AngularFireList<RainLog>;
  tempRef: AngularFireObject<Temp>;


  constructor(private db: AngularFireDatabase) {
    this.tutorialsRef = db.list(this.dbPath);
    this.rainLogRef = db.list(this.rainLogdbPath);
    this.tempRef = db.object(this.testPath);
  }

  getAll(): AngularFireList<Tutorial> {
    return this.tutorialsRef;
  }

  getAllRainLog(): AngularFireList<RainLog> {
    return this.rainLogRef;
  }

  getTemp(): AngularFireObject<Temp> {
    return this.tempRef;
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
