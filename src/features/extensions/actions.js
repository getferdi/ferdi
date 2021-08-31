import PropTypes from 'prop-types';
import { createActionsFromDefinitions } from '../../actions/lib/actions';

const extensionsActions = createActionsFromDefinitions({
  activate: {
    id: PropTypes.string.isRequired,
  },
  addAction: {
    action: PropTypes.object.isRequired,
  },
  addWebView: {
    view: PropTypes.any.isRequired,
  },
  addInfo: {
    id: PropTypes.string.isRequired,
    info: PropTypes.object.isRequired,
  },
}, PropTypes.checkPropTypes);

export default extensionsActions;
