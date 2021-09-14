export const createActionsFromDefinitions = (actionDefinitions, validate) => {
  const actions = {};
  for (const actionName of Object.keys(actionDefinitions)) {
    const action = (params = {}) => {
      const schema = actionDefinitions[actionName];
      validate(schema, params, actionName);
      action.notify(params);
    };
    actions[actionName] = action;
    action.listeners = [];
    action.listen = listener => action.listeners.push(listener);
    action.off = listener => {
      const { listeners } = action;
      listeners.splice(listeners.indexOf(listener), 1);
    };
    action.notify = params =>
      // eslint-disable-next-line unicorn/no-array-for-each
      action.listeners.forEach(listener => listener(params));
  }
  return actions;
};

export default (definitions, validate) => {
  const newActions = {};
  for (const scopeName of Object.keys(definitions)) {
    newActions[scopeName] = createActionsFromDefinitions(
      definitions[scopeName],
      validate,
    );
  }
  return newActions;
};
