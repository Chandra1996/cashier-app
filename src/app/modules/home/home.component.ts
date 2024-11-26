import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }
  tabs = [
    "Cashier Accounting Cash Receive",
    "Cashier Cash Received Tracker",
    "Cashier Acng. Cash Movement",
    "Cashier Acng. Cash Movement Tracker",
    "Accounting Tracker",
    "Finance Dashboard",
    "Revenue Analysis",
    "Cash Audit Report"
  ];

  currentTab=''
  ngOnInit(): void {
    this.currentTab = this.tabs[0];
  }

  onTabChange(event: any) {
    this.currentTab = this.tabs[event];
  }
}
