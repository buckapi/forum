import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  isLogged: boolean = true;
  constructor() { }

getIsLogged() {
if(localStorage.getItem('isLogged') !== null) {
  this.isLogged = true;
}
else {
  this.isLogged = false;
}
return this.isLogged;
}
}
