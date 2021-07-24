import * as CSS from 'csstype';
import { Classes } from 'jss';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import React from 'react';
import injectSheet from 'react-jss';

import { WithTheme } from './withTheme';

import './stories/badge.stories';
import './stories/button.stories';
import './stories/headline.stories';
import './stories/icon.stories';
import './stories/infobox.stories';
import './stories/input.stories';
import './stories/loader.stories';
import './stories/select.stories';
import './stories/textarea.stories';
import './stories/toggle.stories';

import { store } from './stores';

import { theme, ThemeType } from '@meetfranz/theme';
const defaultTheme = theme(ThemeType.default);

const styles = {
  '@global body': {
    margin: 0,
    fontSize: defaultTheme.uiFontSize,
    fontFamily: "'Open Sans', sans-serif",
  },
  container: {
    display: 'flex',
    width: '100%',
  },
  menu: {
    width: 300,
    position: 'fixed' as CSS.Property.Position,
    listStyleType: 'none',
    fontSize: 14,
    overflow: 'scroll',
    height: '100%',
  },
  storyList: {
    paddingLeft: 18,
    marginTop: 5,
    marginBottom: 20,
  },
  stories: {
    width: '100%',
    marginLeft: 320,
    paddingLeft: 40,
    paddingRight: 40,
    borderLeft: '1px solid #CFCFCF',
    background: '#f7f7f7',
  },
  sectionHeadline: {
    fontSize: 30,
  },
  storyHeadline: {
    fontSize: 24,
  },
  story: {
    paddingBottom: 40,
    marginBottom: 40,
    borderBottom: '1px solid #CFCFCF',
  },
  sectionLink: {
    fontWeight: 'bold' as CSS.Property.FontWeight,
    color: '#000',
    textDecoration: 'none',
  },
  storyLink: {
    color: '#000',
    textDecoration: 'none',
  },
};

export const App = injectSheet(styles)(
  observer(({ classes }: { classes: Classes }) => (
    <div className={classes.container}>
      <ul className={classes.menu}>
        {store.stories.sections.map((section, key) => (
          <li key={key}>
            <a href={`#section-${key}`} className={classes.sectionLink}>
              {section.name}
            </a>
            <ul className={classes.storyList}>
              {section.stories.map((story, storyKey) => (
                <li key={storyKey}>
                  <a
                    href={`#section-${key}-story-${storyKey}`}
                    className={classes.storyLink}
                  >
                    {story.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className={classes.stories}>
        {store.stories.sections.map((section, key) => (
          <div key={key}>
            <h1 id={`section-${key}`} className={classes.sectionHeadline}>
              {section.name}
            </h1>
            {section.stories.map((story, storyKey) => (
              <div className={classes.story} key={storyKey}>
                <h2
                  id={`section-${key}-story-${storyKey}`}
                  className={classes.storyHeadline}
                >
                  {story.name}
                </h2>
                <WithTheme>
                  <story.component />
                </WithTheme>
              </div>
            ))}
          </div>
        ))}
      </div>
      <DevTools />
    </div>
  )),
);
