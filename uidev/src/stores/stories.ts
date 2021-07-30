export type StorySectionName = string;
export type StoryName = string;
export type StoryComponent = () => JSX.Element;

export interface IStories {
  name: string;
  component: StoryComponent;
}

export interface ISections {
  name: StorySectionName;
  stories: IStories[];
}

export interface IStoryStore {
  sections: ISections[];
}

export const storyStore: IStoryStore = {
  sections: [],
};

export const storiesOf = (name: StorySectionName) => {
  const length = storyStore.sections.push({
    name,
    stories: [],
  });

  const actions = {
    add: (name: StoryName, component: StoryComponent) => {
      storyStore.sections[length - 1].stories.push({
        name,
        component,
      });

      return actions;
    },
  };

  return actions;
};
