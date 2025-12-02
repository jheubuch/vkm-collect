import { Component, model } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-start',
  imports: [FormsModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './start.html',
  styleUrl: './start.css',
})
export default class Start {
  public vkm = model<string>('');
}
