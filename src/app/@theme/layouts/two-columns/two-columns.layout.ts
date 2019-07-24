import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-two-columns-layout',
  styleUrls: ['./two-columns.layout.scss'],
  templateUrl: './two-columns.layout.html'
})
export class TwoColumnsLayoutComponent implements OnInit {

  ngOnInit() {
    alert("two columns");
  }

}
