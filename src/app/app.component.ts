import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
//import result from '../assets/output.js';
declare const getOutput :any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  /*prepare tree node for nested suites*/
  nestedTreeControl: NestedTreeControl<any>;
  nestedDataSource: MatTreeNestedDataSource<any>;
  dataChange = new BehaviorSubject<any[]>([]);

  public title = 'angular-html-report'; 
  public suiteObject = [];
  public selectedSuite;

  constructor(private http: HttpClient) {
    this.nestedTreeControl = new NestedTreeControl<any>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    this.suiteObject = new getOutput();
    this.dataChange.next(this.suiteObject);
    this.dataChange.subscribe(data => this.nestedDataSource.data = data);

  }

  public getJSON(): any {
    return this.http.get('./output.json');
  }

  hasNestedChild = (_: number, nodeData: any) =>  nodeData._suites.length > 0;

  private _getChildren = (node: any) =>  node._suites;

  selectSuite = (node) => {
    this.selectedSuite = node;
  }
}
