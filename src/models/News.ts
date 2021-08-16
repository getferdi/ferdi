// @flow

interface INews {
  id: string;
  message: string;
  type: string;
  sticky: boolean | undefined;
}

export default class News {
  id: string = '';

  message: string = '';

  type: string = 'primary';

  sticky: boolean = false;

  constructor(data: INews) {
    if (!data.id) {
      throw Error('News requires Id');
    }

    this.id = data.id;
    this.message = data.message || this.message;
    this.type = data.type || this.type;
    this.sticky = data.sticky !== undefined ? data.sticky : this.sticky;
  }
}
