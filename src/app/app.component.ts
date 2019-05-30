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
  public suiteChart: Chart = []; // This will hold our chart info
  public specChart: Chart = [];
  public expectChart: Chart = [];
  public selectedView: string = 'test-details';

  constructor(private http: HttpClient) {
    this.nestedTreeControl = new NestedTreeControl<any>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.suiteObject = new getOutput();
    console.log(this.suiteObject);
    this.dataChange.next(this.suiteObject['suites']);
    this.dataChange.subscribe(data => this.nestedDataSource.data = data);
    //default selection of suite on page load
    this.selectedSuite = this.suiteObject['suites'] && this.suiteObject['suites'][0];

  }

  ngAfterViewInit(){
    this.initCharts();
  }

  setSelectedView = (view) => {
    this.selectedView = view;
    this.destroyCharts();
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  initCharts(){
    this.suiteChart = this.getChart('canvas-chart-suite', this.suiteObject['summary']['suites'], 'doughnut', 'Suite View');
    this.specChart = this.getChart('canvas-chart-spec', this.suiteObject['summary']['specs'], 'doughnut', 'Spec View');
    this.expectChart = this.getChart('canvas-chart-expect', this.suiteObject['summary']['expects'], 'doughnut', 'Expect View');
  }

  destroyCharts(){
    this.suiteChart.destroy();
    this.specChart.destroy();
    this.expectChart.destroy();
  }

  hasNestedChild = (_: number, nodeData: any) =>  nodeData._suites.length > 0;

  private _getChildren = (node: any) =>  node._suites;

  selectSuite = (node) => {
    if(node.status == 'pending'){
      node._specs = [];
    }
    this.selectedSuite = node;
  }

  getChart: Chart = (ele: string, data: any, type: string, chartTitle: string) =>{
    let _chart = {
      label: [],
      data: [],
      color: []
    };

    Object.entries(data).forEach( entry => {
      if( entry[0] != 'total' && entry[0] != 'defined'){
        _chart['label'].push(entry[0]);
        _chart['data'].push(entry[1]);
        _chart['color'].push(this.getColorOfStatus(entry[0]));
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
              borderColor: '#fff',
              borderWidth: 1
          }]
      },
      options: {
        title: {
          display: false,
          text: chartTitle
        },
        legend: {
          position: 'right',
          labels: {usePointStyle: true}
        },
        tooltips: {
          displayColors: false,
          callbacks: {
              label: function(tooltipItem, data) {
                  return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              }
          }
        },
        responsive: true
      }
    });
  }

  getColorOfStatus(status: string){
    switch (status) {
      case 'passed':
       return ('#28a745');
      case 'finished':
        return ('#28a745');
      case 'failed':
        return ('#dc3545');
      case 'disabled':
        return ('#f3b601');
      case 'excluded':
        return ('#f3b601');
      case 'pending':
        return ('#f3b601');
      default:
        console.log('unknown status : setting white color');
        return ('#DDDDDD20');
    }
  }

  getExpectCount(countType: string, specs: any): number{
    let failed = 0, total = 0, passed = 0;
    specs.forEach( spc => {
      failed += spc['failedExpectations'].length;
      passed += spc['passedExpectations'].length;
    });

    total = failed + passed ;

    return (countType == 'total') ? total : ((countType == 'failed') ? failed : passed);
  }
}
