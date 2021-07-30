import React from 'react';

import { H1, H2, H3, H4 } from '@meetfranz/ui';
import { storiesOf } from '../stores/stories';

// interface IStoreArgs {
//   value?: boolean;
//   checked?: boolean;
//   label?: string;
//   id?: string;
//   name?: string;
//   disabled?: boolean;
//   error?: string;
// }

// const createStore = (args?: IStoreArgs) => {
//   return observable(Object.assign({
//     id: `element-${uuid()}`,
//     name: 'toggle',
//     label: 'Label',
//     value: true,
//     checked: false,
//     disabled: false,
//     error: '',
//   },                              args));
// };

// const WithStoreToggle = observer(({ store }: { store: any }) => (
//   <>
//     <Toggle
//       value={store.value}
//       checked={store.checked}
//       label={store.label}
//       id={store.id}
//       name={store.name}
//       disabled={store.disabled}
//       error={store.error}
//       onChange={() => store.checked = !store.checked}
//     />
//   </>
// ));

storiesOf('Typo')
  .add('Headlines', () => (
    <>
      <H1>Welcome to the world of tomorrow</H1>
      <H2>Welcome to the world of tomorrow</H2>
      <H3>Welcome to the world of tomorrow</H3>
      <H4>Welcome to the world of tomorrow</H4>
    </>
  ));
