let sloganTransition = 'none';

if (window && window.matchMedia('(prefers-reduced-motion: no-preference)')) {
  sloganTransition = 'opacity 1s ease';
}

export default {
  component: {
    color: '#FFF',
  },
  slogan: {
    display: 'block',
    opacity: 0,
    transition: sloganTransition,
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
  },
  visible: {
    opacity: 1,
  },
};
