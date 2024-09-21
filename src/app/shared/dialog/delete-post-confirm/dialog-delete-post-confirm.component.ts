import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-dialog-delete-post-confirm',
  templateUrl: 'dialog-delete-post-confirm.component.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogDeletePostConfirmComponent {
  data = inject(MAT_DIALOG_DATA);

}
