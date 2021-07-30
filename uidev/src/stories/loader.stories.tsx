import React from 'react';

import { Loader } from '@meetfranz/ui';
import { storiesOf } from '../stores/stories';

storiesOf('Loader')
  .add('Basic', () => (
    <>
      <Loader />
    </>
  ));
