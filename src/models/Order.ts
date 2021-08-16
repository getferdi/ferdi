// TODO: Can this file be deleted?

interface IOrder {
  id: string;
  subscriptionId: string;
  name: string;
  invoiceUrl: string;
  price: string;
  date: string;
}

export default class Order {
  id: string = '';

  subscriptionId: string = '';

  name: string = '';

  invoiceUrl: string = '';

  price: string = '';

  date: string = '';

  constructor(data: IOrder) {
    this.id = data.id;
    this.subscriptionId = data.subscriptionId;
    this.name = data.name || this.name;
    this.invoiceUrl = data.invoiceUrl || this.invoiceUrl;
    this.price = data.price || this.price;
    this.date = data.date || this.date;
  }
}
