import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

 /*  setUser(user: any, token: string) {
    this.userSubject.next(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  } */
   /*  setUser(user: any, token: string) {
      const userWithId = {
        ...user,
        id: user.id || user._id // asegúrate que tiene el campo id
      };
      this.userSubject.next(userWithId);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithId));
    }
    

  loadFromStorage() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      this.userSubject.next(JSON.parse(user));
    }
  } */
  
    setUser(user: any, token: string) {
      const userWithId = {
        ...user,
        id: user.id || user._id || user.userId // agrega cualquier variante posible
      };
      this.userSubject.next(userWithId);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithId));
    }
    
    loadFromStorage() {
      const user = localStorage.getItem('user');
      if (user) {
        const parsed = JSON.parse(user);
        const userWithId = {
          ...parsed,
          id: parsed.id || parsed._id || parsed.userId
        };
        this.userSubject.next(userWithId);
      }
    }
  getCurrentUser() {
    return this.userSubject.value; // debe contener `id`
  }



  loadUserFromStorage() {
    const stored = localStorage.getItem('user');
    if (stored) this.userSubject.next(JSON.parse(stored));
  }

  
  logout() {
    localStorage.clear();
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

 
}
