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

  expandedRows: { [key: string]: { isActive: boolean; nested: { [key: string]: boolean } } } = {};

  ngOnInit(): void {
    this.getFilterData();
  }

  getFilterData() {
    let apiUrl = 'http://103.92.47.35/hitechErp/Api/Accounting/CashierAccountingCashRecieve.php';
    const payload = {
      financialYearId: 3,
      btn_name: "TRACKER",
      fromDate: "2024-11-26T07:54:05.537Z",
      toDate: "2024-11-26T07:54:05.537Z",
      // fromDate: "2024-11-25T07:54:05.537Z",
      // toDate: "2024-11-25T07:54:05.537Z",
      businessAreaId: "1",
    };

    this.sharedService.getData(apiUrl, payload).subscribe((data: any) => {
      this.cashRecords = this.groupDataByDate(data);
    },
      (error) => {
        console.error(error)
      })
  }



  groupDataByDate(data: any) {
    let groupedData: any = {};

    console.log(data);
    data.forEach((item: any) => {
      if (!groupedData?.[item?.transactionDate]) {
        if (!this.expandedRows?.[item?.transactionDate]) {
          this.expandedRows[item?.transactionDate] = { isActive: false, nested: {} }
        }
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
        let nestedData: any = [];
        try {
          const firstLevel = data.find((infoObj: any) => infoObj.parentLink === item.billManager);
          const secondLevel = firstLevel ? data.find((infoObj: any) => infoObj.parentLink === firstLevel.counterType) : undefined;
          nestedData = [firstLevel, secondLevel];
        } catch (error) {
          console.error("Error in nested data computation:", error);
        }

        this.expandedRows[item?.transactionDate].nested[item.billManager] = false
        groupedData[item.transactionDate].billManagers.push({
          name: item.billManager,
          sysCashClosingBalance: item.sysCashClosingBalance,
          cashRcvAmt: item.cashRcvAmt,
          varience: item.varience,
          nestedData,
        });
      }
    });
    console.log(this.expandedRows)
    return Object.keys(groupedData).map((date) => ({
      date,
      cashDetails: groupedData[date].cashDetails,
      billManagers: groupedData[date].billManagers,
    }));
  }

  toggleRow(date: string) {
    this.expandedRows[date].isActive = !this.expandedRows[date]?.isActive;
  }

  toggleNestedRow(date: string, managerName: string) {
    this.expandedRows[date].nested[managerName] = !this.expandedRows[date].nested[managerName];
  }
  isRowExpanded(date: string): boolean {
    return this.expandedRows[date]?.isActive;
  }
  isNestedRowExpanded(date: string, managerName: string): boolean {
    return this.expandedRows[date].nested[managerName];
  }
}
