// @flow

export default class RecipePreview {
  id: string = '';

  name: string = '';

  icon: string = '';

  featured: boolean = false;

  aliases: string[] = [];

  constructor(data) {
    if (!data.id) {
      throw Error('RecipePreview requires Id');
    }

    Object.assign(this, data);
  }
}
