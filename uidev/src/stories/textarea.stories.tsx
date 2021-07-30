import React from 'react';
import uuid from 'uuid/v4';

import { Textarea } from '@meetfranz/forms';
import { storiesOf } from '../stores/stories';

const defaultProps = () => {
  const id = uuid();
  return {
    label: 'Label',
    id: `test-${id}`,
    name: `test-${id}`,
    rows: 5,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => console.log('changed event', e),
  };
};

storiesOf('Textarea')
  .add('Basic', () => (
    <Textarea
      {...defaultProps()}
      // placeholder="Placeholder text"
    />
  ))
  .add('10 rows', () => (
    <Textarea
      {...defaultProps()}
      rows={10}
    />
  ))
  .add('With error', () => (
    <Textarea
      {...defaultProps()}
      error="This is a generic error message."
    />
  ))
  .add('Disabled', () => (
    <Textarea
      {...defaultProps()}
      rows={2}
      disabled
    />
  ));
