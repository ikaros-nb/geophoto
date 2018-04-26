import { Component } from '@angular/core';
import { AccountInfoPage } from '../account-info/account-info';
import { AccountPhotosPage } from '../account-photos/account-photos';
import { AccountLikesPage } from '../account-likes/account-likes';

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
