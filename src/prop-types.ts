import PropTypes from 'prop-types';

// eslint-disable-next-line
export const oneOrManyChildElements = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.element),
  PropTypes.element,
  PropTypes.array,
]);

export const globalError = PropTypes.shape({
  status: PropTypes.number,
  message: PropTypes.string,
  code: PropTypes.string,
});
