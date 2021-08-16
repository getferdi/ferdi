import { observable } from 'mobx';

interface IUser {
  id: string | null;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  organization: string | null;
  accountType: string | null;
  beta: boolean;
  donor: object;
  isDonor: boolean;
  isMiner: boolean;
  locale: boolean;
  isSubscriptionOwner: boolean;
  hasSubscription: boolean;
  hadSubscription: boolean;
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

  // TODO: Need to delete references to 'subscription' and 'donor'
  // better assume it's confirmed to avoid noise
  @observable subscription = {};

  @observable isSubscriptionOwner = false;

  @observable hasSubscription = true;

  @observable hadSubscription = false;

  @observable beta = false;

  @observable donor = {};

  @observable isDonor = false;

  @observable isMiner = false;

  @observable locale = false;

  @observable team = {};

  constructor(data: IUser) {
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
    this.donor = data.donor || this.donor;
    this.isDonor = data.isDonor || this.isDonor;
    this.isMiner = data.isMiner || this.isMiner;
    this.locale = data.locale || this.locale;

    this.isSubscriptionOwner = data.isSubscriptionOwner || this.isSubscriptionOwner;
    this.hasSubscription = data.hasSubscription || this.hasSubscription;
    this.hadSubscription = data.hadSubscription || this.hadSubscription;

    this.team = data.team || this.team;
  }
}
