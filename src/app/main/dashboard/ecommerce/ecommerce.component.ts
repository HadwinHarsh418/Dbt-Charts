import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { DashboardService } from 'app/main/dashboard/dashboard.service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';

@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceComponent implements OnInit {
  @ViewChild('gainedChartRef') gainedChartRef: any;

  // Public
  public status: any = {total_Survey:  0, total_calls:  0, total_customers: 0};
  public data: any = {total_Survey:  0, total_calls:  0, total_customers: 0};
  public currentUser: User;
  public isAdmin: boolean;
  public isClient: boolean;
  public loadingStats: boolean;


  private $primary = '#7367F0';
  private $warning = '#FF9F43';
  private $info = '#00cfe8';
  private $info_light = '#1edec5';
  private $strok_color = '#b9c3cd';
  private $label_color = '#e7eef7';
  private $white = '#fff';
  private $textHeadingColor = '#5e5873';

  /**
   * Constructor
   * @param {AuthenticationService} _authenticationService
   * @param {DashboardService} _dashboardService
   */
  constructor(
    private _authenticationService: AuthenticationService,
    private _dashboardService: DashboardService,
    private _encryptionService: EncryptionService
  ) {
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
    this.isAdmin = this._authenticationService.isAdmin;
    this.isClient = this._authenticationService.isClient;
  }


  ngOnInit(): void {
    this.loadingStats = true;
  }
}
