import { observable } from 'mobx';

interface IUser {
  id: string | null;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  organization: string | null;
  accountType: string | null;
  beta: boolean;
  locale: boolean;
  isSubscriptionOwner: boolean;
  team: object;
}

// TODO: Need to cleanup these fields since we have removed the tiers of the paid plans from Ferdi
export default class User {
  id: string | null = null;

  @observable email: string | null = null;

  @observable firstname: string | null = null;

  @observable lastname: string | null = null;

  @observable organization: string | null = null;

  @observable accountType: string | null = null;

  @observable emailIsConfirmed = true;

  // Note: Kept around to be able to handle the response from Franz server
  // better assume it's confirmed to avoid noise
  @observable subscription = {};

  @observable isSubscriptionOwner = false;

  @observable beta = false;

  @observable locale = false;

  @observable team = {};

  constructor(data: IUser) {
    if (!data) {
      throw Error('User config not valid');
    }

    if (!data.id) {
      throw Error('User requires Id');
    }

    this.id = data.id;
    this.email = data.email || this.email;
    this.firstname = data.firstname || this.firstname;
    this.lastname = data.lastname || this.lastname;
    this.organization = data.organization || this.organization;
    this.accountType = data.accountType || this.accountType;
    this.beta = data.beta || this.beta;
    this.locale = data.locale || this.locale;

    this.isSubscriptionOwner = data.isSubscriptionOwner || this.isSubscriptionOwner;

    this.team = data.team || this.team;
  }
}
