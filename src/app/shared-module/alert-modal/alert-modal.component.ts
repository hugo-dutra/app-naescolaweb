import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent implements OnInit {

  @Input() public message: string;
  @Input() public type: string = "success";
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  public onClose(): void {
    this.bsModalRef.hide();
  }

}
