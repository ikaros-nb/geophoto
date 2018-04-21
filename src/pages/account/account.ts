import { Component } from '@angular/core';
import { AccountInfoPage } from '../account-info/account-info';
import { AccountPhotosPage } from '../account-photos/account-photos';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  tab1Root = AccountInfoPage;
  tab2Root = AccountPhotosPage;

  constructor() {}
}
