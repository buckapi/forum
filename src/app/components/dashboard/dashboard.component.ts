import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user!: any;
 constructor(public global: GlobalService,
    public auth: AuthService
  ) {}
  ngOnInit(): void {
    this.auth.user$.subscribe(u => this.user = u);

  }
}
