import { reaction } from 'mobx';
import TodoStore from './store';

const debug = require('debug')('Ferdi:feature:todos');

export const todosStore = new TodoStore();

export default function initTodos(stores, actions) {
  stores.todos = todosStore;
  const { features } = stores;

  // Toggle todos feature
  reaction(
    () => (
      features.features.isTodosEnabled
    ),
    (isEnabled) => {
      if (isEnabled) {
        debug('Initializing `todos` feature');
        todosStore.start(stores, actions);
      } else if (todosStore.isFeatureActive) {
        debug('Disabling `todos` feature');
        todosStore.stop();
      }
    },
    { fireImmediately: true },
  );
}
