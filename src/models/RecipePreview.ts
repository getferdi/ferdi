interface IRecipePreview {
  id: string;
  name: string;
  icon: string;
  featured: boolean;
  aliases: string[];
}

export default class RecipePreview {
  id: string = '';

  name: string = '';

  icon: string = '';

  featured: boolean = false;

  aliases: string[] = [];

  constructor(data: IRecipePreview) {
    if (!data) {
      throw new Error('RecipePreview config not valid');
    }

    if (!data.id) {
      throw new Error(`RecipePreview '${data.name}' requires Id`);
    }

    Object.assign(this, data);
  }
}
