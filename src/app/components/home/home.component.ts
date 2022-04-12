import { Component, OnInit, ViewChild } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { Tutorial } from 'src/app/models/tutorial.model';
import { RainLog } from './../../models/tutorial.model';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { map } from 'rxjs/operators';
declare var Microgear: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public online: "Online" | "Offline" = "Offline"
  public temp: Number = 0
  public hum: Number = 0
  public label: any = []
  public water: any = []
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
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  };

  // barChartOptions: any = {
  //   responsive: true,
  //   scales: { //you're missing this
  //     yAxes: [{
  //       scaleLabel: {
  //         display: true,
  //         labelString: 'Frequency Rate'
  //       },
  //       ticks: { // and this

  //       }
  //     }]
  //   }//END scales
  // };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {

      // We use this empty structure as a placeholder for dynamic theming.
      x: {

      },
      'y-axis-0':
      {
        position: 'left',
        display: true,
        ticks: {
          color: 'blue',

        }
      },
      'y-axis-1': {
        position: 'right',
        display: false,
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red'
        }
      }
    },

    plugins: {
      legend: { display: true },
    }
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private microgear = Microgear.create({
    key: 'Sr5FvJyq6aIYZxA',
    secret: 'XaSO8HZuRTmjhgj3TfmXJmfMf',
    alias: 'RainMeterWeb'
    // key: 'RwVp3TRt2uj4KnG',
    // secret: 'jFMXgaJk1jPoltXpFNPV6lrrG',
    // alias: 'WebProject'
  });

  rainLog?: RainLog[];
  tutorials?: Tutorial[];
  currentTutorial?: Tutorial;
  currentIndex = -1;

  constructor(private tutorialService: TutorialService) {
    this.chart?.update();

    this.microgear.connect('RainMeter');
    this.microgear.subscribe('/mqtt/#');

    this.microgear.on('connected', function () {
      console.log("NETPIE Connected");
    });

    this.microgear.on("present", (event: any) => {
      console.log(event);
      if (event.type == "online") {
        this.online = "Online"
      } else {
        this.online = "Offline"
        this.temp = 0
        this.hum = 0
      }
    });

    this.microgear.on("message", (topic: any, msg: any) => {
      // console.log(topic, msg);
      // console.log(msg);
      if (topic == "/RainMeter/mqtt/temp") {
        this.temp = msg
      }
      if (topic == "/RainMeter/mqtt/hum") {
        this.hum = msg
      }
      // console.log(this.temp);
    }
    );

    this.microgear.on("absent", (event: any) => {
      console.log(event);
    });

    // if (this.microgear.onConnect()) {
    //   this.microgear.onMicrogear().on("absent", (event: any) => {
    //     console.log(event);x
    //   });
    // }
  }

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  refreshList(): void {
    this.currentTutorial = undefined;
    this.currentIndex = -1;
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    // this.tutorialService.getAll().snapshotChanges().pipe(
    //   map(changes =>
    //     changes.map(c =>
    //       ({ key: c.payload.key, ...c.payload.val() })
    //     )
    //   )
    // ).subscribe(data => {
    //   this.tutorials = data;
    //   console.log(this.tutorials);
    // });

    this.tutorialService.getAllRainLog().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      console.log(data);
      this.rainLog = data;
      // console.log(this.rainLog);
      // let keys = [...this.rainLog];
      // console.log(keys);
      this.label = []
      this.water = []
      for (var i = 0; i < this.rainLog.length; i++) {
        // console.log(this.rainLog[i]);
        // console.log(Object.values(this.rainLog[i]));
        let rainData = Object.values(this.rainLog[i])
        // console.log(xd);
        rainData.splice(0, 1);
        // Asc
        rainData.sort((a, b) => a.time.localeCompare(b.time));
        // console.log(rainData);
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

  public onConnect() {
    return this.microgear.on('connected', function () {
      console.log("NETPIE Connected");
    });
  }

  public onMicrogear() {
    return this.microgear;
  }

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
