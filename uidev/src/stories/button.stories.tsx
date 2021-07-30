import { mdiInformation } from '@mdi/js';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import injectSheet from 'react-jss';

import { Button, Input } from '@meetfranz/forms';
import { Classes } from 'jss';
import { storiesOf } from '../stores/stories';

const defaultProps = {
  label: 'Button',
  id: 'test1',
  name: 'test1',
  type: 'button',
  disabled: false,
};

const styles = {
  combinedElements: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    marginRight: 20,
  },
};

const createStore = (args?: any) => observable({ ...defaultProps, ...args });

const WithStoreButton = observer(({ store }: { store: any }) => (
  <>
    <Button
      {...({ ...defaultProps, ...store })}
      onClick={!store.onClick ? () => {
        store.busy = !store.busy;

        window.setTimeout(() => {
          store.busy = !store.busy;
        }, 1000);
      } : store.onClick}
    />
  </>
));

storiesOf('Button')
  .add('Basic', () => (
    <WithStoreButton store={createStore()} />
  ))
  .add('Secondary', () => (
    <WithStoreButton store={createStore({
      buttonType: 'secondary',
    })}
    />
  ))
  .add('Success', () => (
    <WithStoreButton store={createStore({
      buttonType: 'success',
    })}
    />
  ))
  .add('Warning', () => (
    <WithStoreButton store={createStore({
      buttonType: 'warning',
    })}
    />
  ))
  .add('Danger', () => (
    <WithStoreButton store={createStore({
      buttonType: 'danger',
    })}
    />
  ))
  .add('Inverted', () => (
    <WithStoreButton store={createStore({
      buttonType: 'inverted',
    })}
    />
  ))
  .add('Full width', () => (
    <WithStoreButton store={createStore({
      stretch: true,
    })}
    />
  ))
  .add('Disabled', () => (
    <WithStoreButton store={createStore({
      disabled: true,
    })}
    />
  ))
  .add('With loader', () => (
    <WithStoreButton store={createStore({
      busy: true,
    })}
    />
  ))
  .add('With icon', () => (
    <WithStoreButton store={createStore({
      icon: mdiInformation,
    })}
    />
  ))
  .add('As link', () => (
    <WithStoreButton store={createStore({
      href: 'https://meetfranz.com',
    })}
    />
  ))
  .add('As link (target=_blank)', () => (
    <WithStoreButton store={createStore({
      href: 'https://meetfranz.com',
      target: '_blank',
    })}
    />
  ))
  .add('As link (with onClick)', () => (
    <WithStoreButton store={createStore({
      href: 'https://meetfranz.com',
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        alert('Click event');
      },
    })}
    />
  ))
  .add('Long multi-line button', () => (
    <WithStoreButton store={createStore({
      label: 'But there is something that I must say to my people, who stand on the warm threshold which leads into the palace of justice: In the process of gaining our rightful place, we must not be guilty of wrongful deeds. Let us not seek to satisfy our thirst for freedom by drinking from the cup of bitterness and hatred. We must forever conduct our struggle on the high plane of dignity and discipline. We must not allow our creative protest to degenerate into physical violence. Again and again, we must rise to the majestic heights of meeting physical force with soul force.',
    })}
    />
  ))
  .add('Button with Input', injectSheet(styles)(observer(({ classes }: { classes: Classes }) => (
    <div className={classes.combinedElements}>
      <Input showLabel={false} className={classes.input} noMargin />
      <WithStoreButton store={createStore({})} />
    </div>
    ))))
  .add('Icon Button with Input', injectSheet(styles)(observer(({ classes }: { classes: Classes }) => (
    <div className={classes.combinedElements}>
      <Input showLabel={false} className={classes.input} noMargin />
      <WithStoreButton store={createStore({
          icon: mdiInformation,
        })}
      />
    </div>
    ))));
