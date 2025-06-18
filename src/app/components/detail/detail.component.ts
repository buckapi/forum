import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-detail',
  imports: [],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent {
constructor(public global: GlobalService, private sanitizer: DomSanitizer){}

  get sanitizedContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.global.topic.content || '');
  }
}
