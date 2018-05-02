import { Component } from '@angular/core';
import { AccountInfoPage } from '@pages/account-info/account-info';
import { AccountPhotosPage } from '@pages/account-photos/account-photos';
import { AccountLikesPage } from '@pages/account-likes/account-likes';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  tab1Root = AccountInfoPage;
  tab2Root = AccountPhotosPage;
  tab3Root = AccountLikesPage;

  constructor() {}
}
