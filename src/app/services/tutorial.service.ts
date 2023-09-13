import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Tutorial } from '../models/tutorial.model';
import { RainLog } from '../models/tutorial.model';
import { Temp } from '../models/tutorial.model';
import { SettingTime } from '../models/tutorial.model';
import { SettingWater } from '../models/tutorial.model';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  private dbPath = '/tutorials';
  private rainLogdbPath = '/rainmeter';
  private testPath = '/test';
  private settingTimePath = '/settingTime';
  private settingWaterPath = '/settingWater';

  tutorialsRef: AngularFireList<Tutorial>;
  rainLogRef: AngularFireList<RainLog>;
  tempRef: AngularFireObject<Temp>;
  settingTimeRef: AngularFireObject<SettingTime>;
  settingWaterRef: AngularFireObject<SettingWater>;


  constructor(private db: AngularFireDatabase) {
    this.tutorialsRef = db.list(this.dbPath);
    this.rainLogRef = db.list(this.rainLogdbPath);
    this.tempRef = db.object(this.testPath);
    this.settingTimeRef = db.object(this.settingTimePath);
    this.settingWaterRef = db.object(this.settingWaterPath);

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

  getSettingTime(): AngularFireObject<SettingTime> {
    return this.settingTimeRef;
  }

  getSettingWater(): AngularFireObject<SettingWater> {
    return this.settingWaterRef;
  }

  create(tutorial: Tutorial): any {
    return this.tutorialsRef.push(tutorial);
  }

  update(key: string, value: any): Promise<void> {
    return this.tutorialsRef.update(key, value);
  }

  updateSettingTime(value: any): Promise<void> {
    return this.settingTimeRef.set(value);
  }

  updateSettingWater(value: any): Promise<void> {
    return this.settingWaterRef.set(value);
  }

  delete(key: string): Promise<void> {
    return this.tutorialsRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.tutorialsRef.remove();
  }
}
