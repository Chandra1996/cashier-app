import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-cash-received-tracker',
  templateUrl: './cash-received-tracker.component.html',
  styleUrls: ['./cash-received-tracker.component.scss']
})
export class CashReceivedTrackerComponent implements OnInit {

  constructor(
    private sharedService: SharedService
  ) { }
  cashRecords: any = [];
  expandedRows: { [key: string]: boolean } = {};
  
  ngOnInit(): void {
    this.getFilterData();
  }

  getFilterData() {
    let apiUrl = 'http://103.92.47.35/hitechErp/Api/Accounting/CashierAccountingCashRecieve.php';
    const payload = {
      financialYearId: 3,
      btn_name: "TRACKER",
      fromDate: "2024-11-25T07:54:05.537Z",
      toDate: "2024-11-25T07:54:05.537Z",
      businessAreaId: "1",
    };

    this.sharedService.getData(apiUrl, payload).subscribe((data: any) => {
      console.log(data);
      this.cashRecords = this.groupDataByDate(data);
      console.log(this.cashRecords);

    })
  }

  groupDataByDate(data: any) {
    let groupedData: any = {};

    data.forEach((item: any) => {
      if (!groupedData?.[item?.transactionDate]) {
        groupedData[item?.transactionDate] = {
          cashDetails: {
            sysCashClosingBalance: 0,
            cashRcvAmt: 0,
            varience: 0,
          },
          billManagers: [],
        };
      }

      groupedData[item.transactionDate].cashDetails.sysCashClosingBalance += parseFloat(item.sysCashClosingBalance);
      groupedData[item.transactionDate].cashDetails.cashRcvAmt += parseFloat(item.cashRcvAmt);
      groupedData[item.transactionDate].cashDetails.varience += parseFloat(item.varience);

      if (item.billManager && !groupedData[item.transactionDate].billManagers.some((bm: any) => bm.name === item.billManager)) {
        groupedData[item.transactionDate].billManagers.push({
          name: item.billManager,
          sysCashClosingBalance: item.sysCashClosingBalance,
          cashRcvAmt: item.cashRcvAmt,
          varience: item.varience
        });
      }
    });

    return Object.keys(groupedData).map((date) => ({
      date,
      cashDetails: groupedData[date].cashDetails,
      billManagers: groupedData[date].billManagers,
    }));
  }

  toggleRow(date: string) {
    this.expandedRows[date] = !this.expandedRows[date];
  }

  isRowExpanded(date: string): boolean {
    return this.expandedRows[date]; 
  }
}
