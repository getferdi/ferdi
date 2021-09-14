import React from 'react';
import { render } from 'react-dom';
import { App } from './app';

const app = () => (
  <App />
);

render(app(), document.querySelector('#root'));
