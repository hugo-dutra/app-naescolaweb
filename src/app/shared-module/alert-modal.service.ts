import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from './alert-modal/alert-modal.component';

export enum AlertTypes {
  DANGER = 'danger',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFORMATION = 'information'
}

@Injectable()
export class AlertModalService {

  constructor(private modalService: BsModalService) { }

  private showAlert(message: string, type: string) {
    const bsModalRef: BsModalRef = this.modalService.show(AlertModalComponent)
    bsModalRef.content.message = message;
    bsModalRef.content.type = type;
  }

  public showAlertDanger(message: string): void {
    this.showAlert(message, AlertTypes.DANGER);
  }

  public showAlertSuccess(message: string): void {
    this.showAlert(message, AlertTypes.SUCCESS);
  }

  public showAlertWarning(message: string): void {
    this.showAlert(message, AlertTypes.WARNING);
  }

  public showAlertInformation(message: string): void {
    this.showAlert(message, AlertTypes.INFORMATION);
  }

}
