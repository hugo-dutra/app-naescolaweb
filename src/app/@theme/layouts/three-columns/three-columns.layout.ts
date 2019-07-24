import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-three-columns-layout',
  styleUrls: ['./three-columns.layout.scss'],
  templateUrl: './three-columns.layout.html',
})
export class ThreeColumnsLayoutComponent implements OnInit {

  ngOnInit() {
    alert("three-columns");
  }
}
