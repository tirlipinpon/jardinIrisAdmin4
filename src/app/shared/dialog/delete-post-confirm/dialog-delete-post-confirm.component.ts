import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {DatePipe, NgIf} from "@angular/common";
import {getFormattedDate} from "../../../utils/getUTCFormattedDate";
import {Post} from "../../types/post";

@Component({
  selector: 'app-dialog-delete-post-confirm',
  templateUrl: 'dialog-delete-post-confirm.component.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, NgIf, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogDeletePostConfirmComponent {
  data: any = inject(MAT_DIALOG_DATA);
  protected readonly getFormattedDate = getFormattedDate;
}
