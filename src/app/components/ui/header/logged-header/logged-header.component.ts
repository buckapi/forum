import { Component, Input } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { GlobalService } from '../../../../services/global.service';
import PocketBase from 'pocketbase';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-logged-header',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './logged-header.component.html',
  styleUrl: './logged-header.component.css'
})
export class LoggedHeaderComponent {
  @Input() user: any;
  corrientes: any[] = [];
  pb: PocketBase;
  mobileMenuOpen: boolean = false;
 constructor(
  public auth: AuthService,
  public global: GlobalService) { 
  this.pb = this.global.pb;
 }
  ngOnInit() {
    this.auth.loadUserFromStorage();
    this.auth.user$.subscribe(user => this.user = user);
    this.global.corrientes$.subscribe((corrientes : any[]) => {
      this.corrientes = corrientes;
    });
  }

  logout() {
    this.auth.logout();
    window.location.href = 'http://localhost:4200/?logout=true';
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
