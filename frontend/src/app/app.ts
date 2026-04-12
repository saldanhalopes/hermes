import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, ButtonModule, TooltipModule, AvatarModule, BadgeModule],
  templateUrl: './app.html'
})
export class App {
  title = 'Hermes Modern EQM';
  isCollapsed = false;
  gxpConnectionActive = true;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
