export default (theme) => ({
  component: {
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 0,
    alignItems: 'center',
    background: theme.colorWebviewErrorHandlerBackground,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 'auto',
    margin: [40, 0, 20],

    '& button': {
      margin: [0, 10, 0, 10],
    },
  },
});
