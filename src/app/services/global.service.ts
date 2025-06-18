import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  activeRoute = 'home';

  isLogged: boolean = true;
  pb = new PocketBase('https://db.redpsicologos.cl:8090');
private corrientesSubject = new BehaviorSubject<any[]>([]);
corrientes$ = this.corrientesSubject.asObservable();
private topicsSubject = new BehaviorSubject<any[]>([]);
topics$ = this.topicsSubject.asObservable();
topic: any;
  constructor() {
    this.initcorrientesRealtime();
    this.inittopicsRealtime();
   }
   setRoute(route: string) {
    this.activeRoute = route;
  }
getIsLogged() {
if(localStorage.getItem('isLogged') !== null) {
  this.isLogged = true;
}
else {
  this.isLogged = false;
}
return this.isLogged;
}
async initcorrientesRealtime() {
  // Fetch inicial
  const result = await this.pb.collection('psychologistsCorrientes').getFullList();
  this.corrientesSubject.next(result);

  // Suscripción realtime
  this.pb.collection('psychologistsCorrientes').subscribe('*', (e: any) => {
    let current = this.corrientesSubject.getValue();
    if (e.action === 'create') {
      current = [...current, e.record];
    } else if (e.action === 'update') {
      current = current.map((c: any) => c.id === e.record.id ? e.record : c);
    } else if (e.action === 'delete') {
      current = current.filter((c: any) => c.id !== e.record.id);
    }
    this.corrientesSubject.next(current);
  });
}
async inittopicsRealtime() {
  // Fetch inicial
  const result = await this.pb.collection('forumTopic').getFullList();
  this.topicsSubject.next(result);

  // Suscripción realtime
  this.pb.collection('forumTopic').subscribe('*', (e: any) => {
    let current = this.topicsSubject.getValue();
    if (e.action === 'create') {
      current = [...current, e.record];
    } else if (e.action === 'update') {
      current = current.map((c: any) => c.id === e.record.id ? e.record : c);
    } else if (e.action === 'delete') {
      current = current.filter((c: any) => c.id !== e.record.id);
    }
    this.topicsSubject.next(current);
  });
}
preTopic(topic: any) {
  this.activeRoute = 'detail';
  this.topic = topic;
}
}
