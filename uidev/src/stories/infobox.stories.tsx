import { mdiEarth } from '@mdi/js';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { Infobox } from '@meetfranz/ui';
import { storiesOf } from '../stores/stories';

interface IStoreArgs {
  icon?: string;
  ctaLabel?: string;
  type?: string;
  dismissable?: boolean;
  className?: string;
}

const createStore = (args?: IStoreArgs) => observable({ type: 'primary',
    ctaOnClick: () => {
      alert('on click handler');
    },
...args });

const WithStoreInfobox = observer(({ store, children }: { store: any, children: string | React.ReactNode }) => (
  <>
    <Infobox
      icon={store.icon}
      ctaLabel={store.ctaLabel}
      type={store.type}
      ctaOnClick={store.ctaOnClick}
      dismissable={store.dismissable}
      className={store.className}
    >
      {children}
    </Infobox>
  </>
));

storiesOf('Infobox')
  .add('Basic', () => (
    <WithStoreInfobox store={createStore()}>Welcome to the world of tomorrow</WithStoreInfobox>
  ))
  .add('Icon + Dismissable', () => (
    <WithStoreInfobox
      store={createStore({
        icon: mdiEarth,
        dismissable: true,
      })}
    >
      Welcome to the world of tomorrow
    </WithStoreInfobox>
  ))
  .add('With CTA', () => (
    <WithStoreInfobox
      store={createStore({
        icon: mdiEarth,
        ctaLabel: 'Ok, hi!',
      })}
    >
      Welcome to the world of tomorrow
    </WithStoreInfobox>
  ))
  .add('With long text', () => (
    <WithStoreInfobox
      store={createStore({
        icon: mdiEarth,
        ctaLabel: 'Ok, hi!',
      })}
    >
      Ferdi is your messaging app / former Emperor of Austria and combines chat & messaging services into one application. Ferdi currently supports Slack, WhatsApp, WeChat, HipChat, Facebook Messenger, Telegram, Google Hangouts,GroupMe, Skype and many more.
    </WithStoreInfobox>
  ))
  .add('Secondary', () => (
    <WithStoreInfobox
      store={createStore({
        icon: mdiEarth,
        ctaLabel: 'Ok, hi!',
        type: 'secondary',
      })}
    >
      Welcome to the world of tomorrow
    </WithStoreInfobox>
  ))
  .add('Success', () => (
    <WithStoreInfobox
      store={createStore({
        icon: mdiEarth,
        ctaLabel: 'Ok, hi!',
        type: 'success',
      })}
    >
      Welcome to the world of tomorrow
    </WithStoreInfobox>
  ))
  .add('Warning', () => (
    <WithStoreInfobox
      store={createStore({
        icon: mdiEarth,
        ctaLabel: 'Ok, hi!',
        type: 'warning',
      })}
    >
      Welcome to the world of tomorrow
    </WithStoreInfobox>
  ))
  .add('Danger', () => (
    <WithStoreInfobox
      store={createStore({
        icon: mdiEarth,
        ctaLabel: 'Ok, hi!',
        type: 'danger',
      })}
    >
      Welcome to the world of tomorrow
    </WithStoreInfobox>
  ))
  .add('Inverted', () => (
    <WithStoreInfobox
      store={createStore({
        icon: mdiEarth,
        ctaLabel: 'Ok, hi!',
        type: 'inverted',
      })}
    >
      Welcome to the world of tomorrow
    </WithStoreInfobox>
  ))
  .add('With className', () => (
    <WithStoreInfobox store={createStore({
      className: 'franz-is-awesome',
    })}
    >
      Welcome to the world of tomorrow
    </WithStoreInfobox>
  ));
