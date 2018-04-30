import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public authService: AuthService, public router: Router) { }
  login() {
    this.authService.login();
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  ngOnInit() {
  }

}
