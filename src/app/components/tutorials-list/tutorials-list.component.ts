import { RainLog } from './../../models/tutorial.model';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { Tutorial } from 'src/app/models/tutorial.model';
import { map } from 'rxjs/operators';
// import * as variable from 'Microgear';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
declare var Microgear: any;


@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.css']
})
export class TutorialsListComponent implements OnInit {
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'Series B',
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
        fill: 'origin',
      },
      {
        data: [180, 480, 770, 90, 1000, 270, 400],
        label: 'Series C',
        yAxisID: 'y-axis-1',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {},
      'y-axis-0':
      {
        position: 'left',
      },
      'y-axis-1': {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red'
        }
      }
    },

    // plugins: {
    //   legend: { display: true },
    //   annotation: {
    //     annotations: [
    //       {
    //         type: 'line',
    //         scaleID: 'x',
    //         value: 'March',
    //         borderColor: 'orange',
    //         borderWidth: 2,
    //         label: {
    //           position: 'center',
    //           enabled: true,
    //           color: 'orange',
    //           content: 'LineAnno',
    //           font: {
    //             weight: 'bold'
    //           }
    //         }
    //       },
    //     ],
    //   }
    // }
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
  title = '';
  devicesArray?: [];

  constructor(private elementRef: ElementRef, private tutorialService: TutorialService) {
    // this.lineChartData.datasets.slice();

    this.chart?.update();

    this.microgear.connect('RainMeter');
    this.microgear.subscribe('/mqtt/#');

    this.microgear.on('connected', function () {
      console.log("NETPIE Connected");
    });

    this.microgear.on("present", (event: any) => {
      console.log(event);

    });

    this.microgear.on("message", (topic: string, msg: string) => {
      console.log(topic);
      console.log(msg);
    });

    this.microgear.on("absent", (event: any) => {
      console.log(event);
    });

    // if (this.microgear.onConnect()) {
    //   this.microgear.onMicrogear().on("absent", (event: any) => {
    //     console.log(event);
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
    this.tutorialService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.tutorials = data;
      console.log(this.tutorials);
    });

    this.tutorialService.getAllRainLog().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.rainLog = data;
      // console.log(this.rainLog);

      // let keys = [...this.rainLog];
      // console.log(keys);

      for (var i = 0; i < this.rainLog.length; i++) {
        console.log(this.rainLog[i]);
        // console.log(Object.values(this.rainLog[i]));
        let xd = Object.values(this.rainLog[i])
        // console.log(xd);


        //         const result = Object
        //         .keys(this.rainLog[i]).k)
        //         .map(k => myJSON.countries[k])
        //         .map(({ currencies }) => currencies)
        //         .map(currency => Object.keys(currency)[0]);

        // console.log(result);

      }

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

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  removeAllTutorials(): void {
    this.tutorialService.deleteAll()
      .then(() => this.refreshList())
      .catch(err => console.log(err));
  }

  public onConnect() {
    return this.microgear.on('connected', function () {
      console.log("NETPIE Connected");
    });
  }

  public onMicrogear() {
    return this.microgear;
  }







}


