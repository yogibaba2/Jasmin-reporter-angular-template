import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

import Chart from 'chart.js';

declare const getOutput :any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {
  
  /*prepare tree node for nested suites*/
  nestedTreeControl: NestedTreeControl<any>;
  nestedDataSource: MatTreeNestedDataSource<any>;
  dataChange = new BehaviorSubject<any[]>([]);

  public title = 'angular-html-report'; 
  public suiteObject = [];
  public selectedSuite;
  public suiteChart = []; // This will hold our chart info
  public specChart = [];
  public expectChart = [];

  constructor(private http: HttpClient) {
    this.nestedTreeControl = new NestedTreeControl<any>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.suiteObject = new getOutput();
    this.dataChange.next(this.suiteObject['suites']);
    this.dataChange.subscribe(data => this.nestedDataSource.data = data);
    this.selectedSuite = this.suiteObject['suites'] && this.suiteObject['suites'][0];
  }

  ngAfterViewInit(){
    this.suiteChart = this.getChart('canvas-chart-suite', this.suiteObject['summary']['suites'], 'doughnut');
    this.specChart = this.getChart('canvas-chart-spec', this.suiteObject['summary']['specs'], 'doughnut');
    this.expectChart = this.getChart('canvas-chart-expect', this.suiteObject['summary']['expects'], 'doughnut');
  }

  hasNestedChild = (_: number, nodeData: any) =>  nodeData._suites.length > 0;

  private _getChildren = (node: any) =>  node._suites;

  selectSuite = (node) => {
    this.selectedSuite = node;
  }

  getChart: Chart = (ele: string, data: any, type: string) =>{
    let _chart = {
      label: [],
      data: [],
      color: []
    };

    Object.entries(data).forEach( entry => {
      if( entry[0] != 'total' && entry[0] != 'defined'){
        _chart['label'].push(entry[0]);
        _chart['data'].push(entry[1]);

        switch (entry[0]) {
          case 'passed':
            _chart['color'].push('#28a745');
            break;
          case 'failed':
            _chart['color'].push('#dc3545');
            break;
          case 'disabled':
            _chart['color'].push('#f3b601');
            break;
          case 'excluded':
            _chart['color'].push('#f3b601');
            break;
          case 'pending':
            _chart['color'].push('#146dce');
            break;
          default:
            console.log('unknown status : setting white color');
            //_chart['color'].push('#DDDDDD20');
            break;
        }
      }

    });
    return new Chart(ele, {
      type: type,
      data: {
          labels: _chart.label,
          datasets: [{
              label: _chart.label,
              data: _chart.data,
              backgroundColor: _chart.color,
              borderColor: _chart.color,
              borderWidth: 1
          }]
      },
      options: {
        legend: {
          position: 'right',
          labels: {usePointStyle: true}
        }
      }
    });
  }
}
