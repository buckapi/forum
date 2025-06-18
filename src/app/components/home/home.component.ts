import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import PocketBase from 'pocketbase';
import { GlobalService } from '../../services/global.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  corrientes: any[] = [];
  topics: any[] = [];
  user!: any;
  pb: PocketBase;

  constructor(public global: GlobalService,
    public auth: AuthService
  ) 
  {  this.pb = this.global.pb;
  }
  ngOnInit(): void {
    
    this.auth.user$.subscribe(u => this.user = u);

    this.global.corrientes$.subscribe((corrientes : any[]) => {
      this.corrientes = corrientes;
    });
    this.global.topics$.subscribe((topics : any[]) => {
      this.topics = topics;
    });
  }
  
}
