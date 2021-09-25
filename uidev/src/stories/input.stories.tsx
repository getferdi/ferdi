import React from 'react';

import { Input } from '@meetfranz/forms';
import { v4 as uuid } from 'uuid';
import { storiesOf } from '../stores/stories';

const defaultProps = () => {
  const id = uuid();
  return {
    label: 'Label',
    id: `test-${id}`,
    name: `test-${id}`,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      console.log('changed event', e),
  };
};

const defaultPasswordProps = () => {
  const id = uuid();
  return {
    label: 'Password',
    id: `test-${id}`,
    name: `test-${id}`,
    type: 'password',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      console.log('changed event', e),
  };
};

storiesOf('Input')
  .add('Basic', () => (
    <Input {...defaultProps()} placeholder="Placeholder text" />
  ))
  .add('Without Label', () => <Input {...defaultProps()} showLabel={false} />)
  .add('Disabled', () => <Input {...defaultProps()} disabled />)
  .add('With prefix', () => <Input {...defaultProps()} prefix="https://" />)
  .add('With suffix', () => (
    <Input {...defaultProps()} suffix=".meetfranz.com" />
  ))
  .add('With pre-suffix', () => (
    <Input {...defaultProps()} prefix="https://" suffix=".meetfranz.com" />
  ))
  .add('With error', () => (
    <Input
      {...defaultProps()}
      value="faulty input"
      error="This is a generic error message."
    />
  ))
  .add('Type number with min & max', () => (
    <Input {...defaultProps()} type="number" min={1} max={10} />
  ));

storiesOf('Password')
  .add('Basic', () => <Input {...defaultPasswordProps()} />)
  .add('Show password toggle', () => (
    <Input {...defaultPasswordProps()} showPasswordToggle />
  ))
  .add('Score password', () => (
    <Input {...defaultPasswordProps()} showPasswordToggle scorePassword />
  ))
  .add('Score password with error', () => (
    <Input
      {...defaultPasswordProps()}
      error="Password is too short"
      showPasswordToggle
      scorePassword
    />
  ));
