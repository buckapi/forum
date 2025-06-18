import { Component, OnInit } from '@angular/core';
import { LoggedHeaderComponent } from './components/ui/header/logged-header/logged-header.component';
import { UnloggedHeaderComponent } from './components/ui/header/unlogged-header/unlogged-header.component';
import { HomeComponent } from './components/home/home.component';
import { GlobalService } from './services/global.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateComponent } from './components/create/create.component';
import { DetailComponent } from './components/detail/detail.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LoggedHeaderComponent,
    UnloggedHeaderComponent,
    CommonModule,
    HomeComponent,
    DashboardComponent,
    CreateComponent,
    DetailComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'forum';
  user: any;

  constructor(public global: GlobalService,
    private http: HttpClient, 
    private route: ActivatedRoute,
     public auth: AuthService
  ) { 
    this.auth.loadFromStorage();
    this.auth.user$.subscribe(user => {
      this.user = user;
    });
  }
 
  ngOnInit() {
    this.global.getIsLogged();
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.http.post<any>('https://db.redpsicologos.cl:4000/api/verify-code', { code }).subscribe({
          next: res => {
            this.auth.setUser(res.user, res.token);
            // redirige si deseas limpiar la URL
            window.history.replaceState({}, '', '/');
          },
          error: err => {
            console.error('Error al verificar código', err);
          }
        });
      } 
    });
  }
  getIsLogged() {
    return this.global.getIsLogged();
  }


}
