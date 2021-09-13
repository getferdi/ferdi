import PropTypes from 'prop-types';

export default {
  update: {
    type: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
  },
  remove: {
    type: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  },
};
