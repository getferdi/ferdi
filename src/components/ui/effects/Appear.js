import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Appear extends Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    children: PropTypes.any.isRequired,
    transitionName: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    transitionName: 'fadeIn',
    className: '',
  };

  state = {
    mounted: false,
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { children, transitionName, className } = this.props;

    if (!this.state.mounted) {
      return null;
    }

    return (
      <ReactCSSTransitionGroup
        transitionName={transitionName}
        transitionAppear
        transitionLeave
        transitionAppearTimeout={1500}
        transitionEnterTimeout={1500}
        transitionLeaveTimeout={1500}
        className={className}
      >
        {children}
      </ReactCSSTransitionGroup>
    );
  }
}
