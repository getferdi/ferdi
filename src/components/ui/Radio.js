import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Field } from 'mobx-react-form';
import classnames from 'classnames';

@observer
class Radio extends Component {
  static propTypes = {
    field: PropTypes.instanceOf(Field).isRequired,
    className: PropTypes.string,
    focus: PropTypes.bool,
    showLabel: PropTypes.bool,
  };

  static defaultProps = {
    className: null,
    focus: false,
    showLabel: true,
  };

  inputElement = null;

  componentDidMount() {
    if (this.props.focus) {
      this.focus();
    }
  }

  focus() {
    this.inputElement.focus();
  }

  render() {
    const { field, className, showLabel } = this.props;

    return (
      <div
        className={classnames({
          'franz-form__field': true,
          'has-error': field.error,
          [`${className}`]: className,
        })}
      >
        {field.label && showLabel && (
          <label className="franz-form__label" htmlFor={field.name}>
            {field.label}
          </label>
        )}
        <div className="franz-form__radio-wrapper">
          {field.options.map(type => (
            <label
              key={type.value}
              htmlFor={`${field.id}-${type.value}`}
              className={classnames({
                'franz-form__radio': true,
                'is-selected': field.value === type.value,
              })}
            >
              <input
                id={`${field.id}-${type.value}`}
                type="radio"
                name="type"
                value={type.value}
                onChange={field.onChange}
                checked={field.value === type.value}
              />
              {type.label}
            </label>
          ))}
        </div>
        {field.error && <div className="franz-form__error">{field.error}</div>}
      </div>
    );
  }
}

export default Radio;
