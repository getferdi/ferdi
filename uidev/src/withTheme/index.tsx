import { theme, Theme, ThemeType } from '@meetfranz/theme';
import { Classes } from 'jss';
import React from 'react';
import injectSheet, { ThemeProvider } from 'react-jss';

const defaultTheme = {
  name: 'Default',
  variables: theme(ThemeType.default),
};

const darkTheme = {
  name: 'Dark Mode',
  variables: theme(ThemeType.dark),
};

const themes = [defaultTheme, darkTheme];

const styles = (theme: Theme) => ({
  title: {
    fontSize: 14,
  },
  container: {
    border: theme.inputBorder,
    borderRadius: theme.borderRadiusSmall,
    marginBottom: 20,
    padding: 20,
    background: theme.colorContentBackground,
  },
});

const Container = injectSheet(styles)(({ name, classes, story }: { name: string, classes: Classes, story: React.ReactNode }) => (
  <article>
    <h1 className={classes.title}>{name}</h1>
    <div className={classes.container}>
      {story}
    </div>
  </article>
));

export const WithTheme = ({ children }: { children: React.ReactChild }) => (
  <>
    {themes.map((theme, key) => (
      <ThemeProvider key={key} theme={theme.variables}>
        <Container story={children} name={theme.name} />
      </ThemeProvider>
        ))}
  </>
  );
