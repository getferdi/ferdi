export default (theme) => ({
  component: {
    zIndex: 500,
    position: 'absolute',
  },
  overlay: {
    background: theme.colorModalOverlayBackground,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
  },
  modal: {
    background: theme.colorModalBackground,
    maxWidth: '90%',
    height: 'auto',
    margin: 'auto auto',
    borderRadius: 6,
    boxShadow: '0px 13px 40px 0px rgba(0,0,0,0.2)',
    position: 'relative',
  },
  content: {
    padding: 20,
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 20,
  },
});
