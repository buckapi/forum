import { Component, OnInit } from '@angular/core';
import { LoggedHeaderComponent } from './components/ui/header/logged-header/logged-header.component';
import { UnloggedHeaderComponent } from './components/ui/header/unlogged-header/unlogged-header.component';
import { HomeComponent } from './components/home/home.component';
import { GlobalService } from './services/global.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LoggedHeaderComponent,
    UnloggedHeaderComponent,
    CommonModule,
    HomeComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'forum';
  constructor(public global: GlobalService) { }
  ngOnInit() {
    this.global.getIsLogged();
  }
  getIsLogged() {
    return this.global.getIsLogged();
  }
}
