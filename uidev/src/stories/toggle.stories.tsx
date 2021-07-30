import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import uuid from 'uuid/v4';

import { Toggle } from '@meetfranz/forms';
import { storiesOf } from '../stores/stories';

interface IStoreArgs {
  value?: boolean;
  checked?: boolean;
  label?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  error?: string;
}

const createStore = (args?: IStoreArgs) => observable({ id: `element-${uuid()}`,
    name: 'toggle',
    label: 'Label',
    value: true,
    checked: false,
    disabled: false,
    error: '',
...args });

const WithStoreToggle = observer(({ store }: { store: any }) => (
  <>
    <Toggle
      value={store.value}
      checked={store.checked}
      label={store.label}
      id={store.id}
      name={store.name}
      disabled={store.disabled}
      error={store.error}
      onChange={() => store.checked = !store.checked}
    />
  </>
));

storiesOf('Toggle')
  .add('Basic', () => (
    <WithStoreToggle store={createStore()} />
  ))
  .add('Checked', () => (
    <WithStoreToggle store={createStore({
      checked: true,
    })}
    />
  ))
  .add('Disabled', () => (
    <WithStoreToggle store={createStore({
      checked: true,
      disabled: true,
    })}
    />
  ))
  .add('Long label', () => (
    <WithStoreToggle store={createStore({
      label: 'Hello world, this is an insanely long label for this toggle. We need to make sure that it will be displayed correctly.',
    })}
    />
  ))
  .add('With error', () => (
    <WithStoreToggle store={createStore({
      error: 'Something went wrong',
    })}
    />
  ));
