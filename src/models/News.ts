// @flow

import { ifUndefinedString, ifUndefinedBoolean } from '../jsUtils';

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
    this.message = ifUndefinedString(data.message, this.message);
    this.type = ifUndefinedString(data.type, this.type);
    this.sticky = ifUndefinedBoolean(data.sticky, this.sticky);
  }
}
