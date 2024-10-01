import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogErrorComponent } from './Errors/log-error.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LogErrorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'a1-sauce-ng';
}
