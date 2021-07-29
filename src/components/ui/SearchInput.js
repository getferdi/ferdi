import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { debounce } from 'lodash';

export default @observer class SearchInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onReset: PropTypes.func,
    name: PropTypes.string,
    throttle: PropTypes.bool,
    throttleDelay: PropTypes.number,
    autoFocus: PropTypes.bool,
  };

  static defaultProps = {
    value: '',
    placeholder: '',
    className: '',
    name: 'searchInput',
    throttle: false,
    throttleDelay: 250,
    onChange: () => null,
    onReset: () => null,
    autoFocus: false,
  }

  input = null;

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };

    this.throttledOnChange = debounce(this.throttledOnChange, this.props.throttleDelay);
  }

  componentDidMount() {
    const { autoFocus } = this.props;

    if (autoFocus) {
      this.input.focus();
    }
  }

  onChange(e) {
    const { throttle, onChange } = this.props;
    const { value } = e.target;
    this.setState({ value });

    if (throttle) {
      e.persist();
      this.throttledOnChange(value);
    } else {
      onChange(value);
    }
  }

  throttledOnChange(e) {
    const { onChange } = this.props;

    onChange(e);
  }

  reset() {
    const { onReset } = this.props;
    this.setState({ value: '' });

    onReset();
  }

  render() {
    const { className, name, placeholder } = this.props;
    const { value } = this.state;

    return (
      <div
        className={classnames([
          className,
          'search-input',
        ])}
      >
        <label
          htmlFor={name}
          className="mdi mdi-magnify"
        >
          <input
            name={name}
            id={name}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => this.onChange(e)}
            ref={(ref) => { this.input = ref; }}
          />
        </label>
        {value.length > 0 && (
          <span
            className="mdi mdi-close-circle-outline"
            onClick={() => this.reset()}
          />
        )}
      </div>
    );
  }
}
