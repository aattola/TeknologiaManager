import React from 'react';
import { render } from 'react-dom';
import App from './App';

const customTitlebar = require('custom-electron-titlebar');

new customTitlebar.Titlebar({
  backgroundColor: customTitlebar.Color.fromHex('#444'),
});

render(<App />, document.getElementById('root'));
