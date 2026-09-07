import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CursorInteractionComponent } from './layout/cursor/cursor-interaction.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CursorInteractionComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
