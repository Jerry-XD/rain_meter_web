import { Component, OnInit, ViewChild } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { Tutorial } from 'src/app/models/tutorial.model';
import { RainLog } from './../../models/tutorial.model';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { map } from 'rxjs/operators';
// declare var Microgear: any;
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import * as moment from 'moment';

interface Time {
  value: string;
  viewValue: string;
}

interface Water {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // public online: "Online" | "Offline" = "Offline"
  selectedTimeValue: string;
  selectedWaterValue: string;
  times: Time[] = [
    { value: '10', viewValue: '10 นาที' },
    { value: '15', viewValue: '15 นาที' },
  ];
  waters: Water[] = [
    { value: '60', viewValue: '60 มิลลิเมตร' },
    { value: '90', viewValue: '90 มิลลิเมตร' },
  ];
  public temp: Number = 0
  public hum: Number = 0
  public label: any[] = []
  public water: any[] = []
  public x: any = []
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'ปริมาณน้ำฝน (มิลลิเมตร)',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
    ],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        beginAtZero: true,
        // ticks: {
        //   color: 'green',
        // },
      },
      // y1: {
      //   position: 'right',
      //   grid: {
      //     color: 'rgba(255,0,0,0.3)',
      //   },
      //   ticks: {
      //     color: 'red',
      //   },
      //   beginAtZero: true,
      // },
      x: {
        beginAtZero: true,
      },
      // 'y-axis-0':
      // {
      //   position: 'left',
      //   display: true,
      //   ticks: {
      //     color: 'blue',
      //   }
      // },
      // 'y-axis-1': {
      //   position: 'right',
      //   display: false,
      //   grid: {
      //     color: 'rgba(255,0,0,0.3)',
      //   },
      //   ticks: {
      //     color: 'red'
      //   }
      // }
    },

    plugins: {
      legend: { display: true },
    }
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  // xx?: RainLog[];
  rainLog?: RainLog[];
  tutorials?: Tutorial[];
  currentTutorial?: Tutorial;
  currentIndex = -1;
  constructor(private tutorialService: TutorialService) {
    this.chart?.update();
  }

  events: string[] = [];
  selected: Date | null;
  selectedStart: any;
  selectedEnd: any;

  updateSetting(): void {
    this.tutorialService.updateSettingTime(this.selectedTimeValue)
      .then(() => console.log("update time success"))
      .catch(err => console.log(err));


    this.tutorialService.updateSettingWater(this.selectedWaterValue)
      .then(() => console.log("update water success"))
      .catch(err => console.log(err));
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    // this.events.push(`${type}: ${event.value}`);
    // console.log("7",moment(this.selected).format('DD-MM-YYYY'));
    this.retrieveRainLogWithDate(moment(this.selected).format('DD-MM-YYYY'));
  }

  addStartRangeEvent(type: string, event: any) {
    // if (event.value) {
    //   console.log(event.value);
    // }
    this.selectedStart = event.value;
    // console.log("selectedStart", this.selectedStart)
  }

  addEndRangeEvent(type: string, event: any) {
    // if (event.value) {
    //   console.log(event.value);
    // }
    this.selectedEnd = event.value;
    // console.log("selectedEnd", this.selectedEnd)
    // console.log(this.getDatesBetween(this.selectedStart, this.selectedEnd))
    this.retrieveRainLogWithArrDate(this.getDatesBetween(this.selectedStart, this.selectedEnd))
  }

  getDatesBetween(start: string, end: string): string[] {
    const dates = [];
    const datesString = [];
    let startDate = new Date(start);
    let endDate = new Date(end);
    let currentDate = new Date(startDate);
    // console.log(startDate, endDate, currentDate)
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      datesString.push(moment(new Date(currentDate)).format('DD-MM-YYYY'))
      currentDate.setDate(currentDate.getDate() + 1);
    }
    // console.log(datesString)
    return datesString;
  }

  retrieveRainLogWithArrDate(date: string[]): void {
    console.log("date :", date);
    this.tutorialService.getAllRainLog().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      // console.log(data);
      this.rainLog = data;
      this.label = []
      this.water = []
      for (var i = 0; i < this.rainLog.length; i++) {
        let rainData = Object.values(this.rainLog[i])
        // console.log(rainData[0], date[j], (rainData[0] += '') == date[j]);
        for (var j = 0; j < date.length; j++) {
          if ((rainData[0] += '') == date[j]) {
            rainData.splice(0, 1);
            // Asc
            rainData.sort((a, b) => a.time.localeCompare(b.time));
            const label = rainData.map(item => item.time.toString());
            const water = rainData.map(item => item.water);
            label.forEach(element => {
              this.label.push(element);
            });
            water.forEach(element => {
              this.water.push(element);
            });
          }
          this.lineChartData.labels = [...this.label];
          this.lineChartData.datasets[0].data = [...this.water];
        }
        this.chart?.update();
      }
    });
  }

  retrieveRainLogWithDate(date: string): void {
    console.log("date :", date);
    this.tutorialService.getAllRainLog().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      // console.log(data);
      this.rainLog = data;
      this.label = []
      this.water = []
      for (var i = 0; i < this.rainLog.length; i++) {
        let rainData = Object.values(this.rainLog[i])
        // console.log(rainData[0], date, (rainData[0] += '') == date);
        if ((rainData[0] += '') == date) {
          rainData.splice(0, 1);
          // Asc
          rainData.sort((a, b) => a.time.localeCompare(b.time));
          const label = rainData.map(item => item.time.toString());
          const water = rainData.map(item => item.water);
          label.forEach(element => {
            this.label.push(element);
          });
          water.forEach(element => {
            this.water.push(element);
          });
        }
        this.lineChartData.labels = [...this.label];
        this.lineChartData.datasets[0].data = [...this.water];
        this.chart?.update();
      }
    });
  }

  // clickDatePicker(): void {
  //  console.log("XDXDXDXDXD");
  // }

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  refreshList(): void {
    this.currentTutorial = undefined;
    this.currentIndex = -1;
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    this.tutorialService.getSettingTime().valueChanges().subscribe(data => {
      console.log(data);
      this.selectedTimeValue = String(data);
    });

    this.tutorialService.getSettingWater().valueChanges().subscribe(data => {
      console.log(data);
      this.selectedWaterValue = String(data);
    });


    this.tutorialService.getTemp().valueChanges().subscribe(data => {
      // console.log(data);
      // console.log(data?.hum);
      // console.log(data?.temp);
      this.hum = Number(data?.hum);
      this.temp = Number(data?.temp);
    });

    this.tutorialService.getAllRainLog().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      console.log("data", data);
      this.rainLog = data;
      // console.log(this.rainLog);
      // let keys = [...this.rainLog];
      // console.log(keys);
      this.label = []
      this.water = []
      for (var i = 0; i < this.rainLog.length; i++) {
        // console.log(Object.values(this.rainLog[i]));
        let rainData = Object.values(this.rainLog[i])
        rainData.splice(0, 1);
        // Asc
        // rainData.sort((a, b) => a.time.localeCompare(b.time));
        rainData.sort((a, b) => a.time.localeCompare(b.time));
        const label = rainData.map(item => item.time.toString());
        // console.log(label);
        const water = rainData.map(item => item.water);
        // console.log(water);
        // let tmp = [1, 2, 3, 4, 56, 55, 40];
        label.forEach(element => {
          this.label.push(element);
        });
        water.forEach(element => {
          this.water.push(element);
        });
        // this.lineChartData.labels = [...label];
        // this.lineChartData.datasets[0].data = [...water];
        // console.log(this.lineChartData.datasets[0].data);
        // this.chart?.update();
      }
      // this.label.sort((a, b) => a.time.localeCompare(b.time));
      // this.water.sort((a, b) => a.time.localeCompare(b.time));

      this.lineChartData.labels = [...this.label];
      this.lineChartData.datasets[0].data = [...this.water];
      this.chart?.update();

      // var result = [];
      // for (var i = 0; i < this.rainLog.length; i++) {
      //   result[i] = new Array(this.rainLog[0].length).fill();

      //   for (var j = 0; j < this.rainLog.length; j++) {
      //     result[i][j] = this.rainLog[j]; // Here is the fixed column access using the outter index i.
      //   }
      // }

      // console.log(result);

    });
  }

  dynamicSort(property: any) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a: any, b: any) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  // public onConnect() {
  //   return this.microgear.on('connected', function () {
  //     console.log("NETPIE Connected");
  //   });
  // }

  // public onMicrogear() {
  //   return this.microgear;
  // }

  // Asc
  // xd.sort((a, b) => a.time.localeCompare(b.time));a
  // xd.sort(function (a, b) {
  //   return a.time.localeCompare(b.time);
  // });
  // console.log(xd);
  // xd.sort(this.dynamicSort("time"));
  // Desc
  // xd.sort((a, b) => b.time.localeCompare(a.time));
  // console.log(xd);
  // xd.sort(function (a, b) {
  //   return b.time.localeCompare(a.time);
  // });
  // console.log(xd);
  // xd.sort(this.dynamicSort("-time"));
  // console.log(xd);

}
