import {
  mdiArrowRightDropCircleOutline,
  mdiCloseCircle,
  mdiMagnify,
} from '@mdi/js';
import Icon from '@mdi/react';
import classnames from 'classnames';
import React, { Component, createRef } from 'react';
import injectStyle from 'react-jss';

import { IFormField, IWithStyle } from '../typings/generic';
import { Theme } from '../../../theme';

import { Error } from '../error';
import { Label } from '../label';
import { Wrapper } from '../wrapper';

interface IOptions {
  [index: string]: string;
}

interface IData {
  [index: string]: string;
}

interface IProps extends IFormField, IWithStyle {
  actionText: string;
  className?: string;
  inputClassName?: string;
  defaultValue?: string;
  disabled?: boolean;
  id?: string;
  name: string;
  options: IOptions;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showSearch: boolean;
  data: IData;
}

interface IState {
  open: boolean;
  value: string;
  needle: string;
  selected: number;
  options: IOptions;
}

let popupTransition: string = 'none';
let toggleTransition: string = 'none';

if (window && window.matchMedia('(prefers-reduced-motion: no-preference)')) {
  popupTransition = 'all 0.3s';
  toggleTransition = 'transform 0.3s';
}

const styles = (theme: Theme) => ({
  select: {
    background: theme.selectBackground,
    border: theme.selectBorder,
    borderRadius: theme.borderRadiusSmall,
    height: theme.selectHeight,
    fontSize: theme.uiFontSize,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    color: theme.selectColor,
  },
  label: {
    '& > div': {
      marginTop: 5,
    },
  },
  popup: {
    opacity: 0,
    height: 0,
    overflowX: 'scroll',
    border: theme.selectBorder,
    borderTop: 0,
    transition: popupTransition,
  },
  open: {
    opacity: 1,
    height: 350,
    background: theme.selectPopupBackground,
  },
  option: {
    padding: 10,
    borderBottom: theme.selectOptionBorder,
    color: theme.selectOptionColor,

    '&:hover': {
      background: theme.selectOptionItemHover,
      color: theme.selectOptionItemHoverColor,
    },
    '&:active': {
      background: theme.selectOptionItemActive,
      color: theme.selectOptionItemActiveColor,
    },
  },
  selected: {
    background: theme.selectOptionItemActive,
    color: theme.selectOptionItemActiveColor,
  },
  toggle: {
    marginLeft: 'auto',
    fill: theme.selectToggleColor,
    transition: toggleTransition,
  },
  toggleOpened: {
    transform: 'rotateZ(90deg)',
  },
  searchContainer: {
    display: 'flex',
    background: theme.selectSearchBackground,
    alignItems: 'center',
    paddingLeft: 10,
    color: theme.selectColor,

    '& svg': {
      fill: theme.selectSearchColor,
    },
  },
  search: {
    border: 0,
    width: '100%',
    fontSize: theme.uiFontSize,
    background: 'none',
    marginLeft: 10,
    padding: [10, 0],
    color: theme.selectSearchColor,
  },
  clearNeedle: {
    background: 'none',
    border: 0,
  },
  focused: {
    fontWeight: 'bold',
    background: theme.selectOptionItemHover,
    color: theme.selectOptionItemHoverColor,
  },
  hasError: {
    borderColor: theme.brandDanger,
  },
  disabled: {
    opacity: theme.selectDisabledOpacity,
  },
});

class SelectComponent extends Component<IProps> {
  public static defaultProps = {
    onChange: () => {},
    showLabel: true,
    disabled: false,
    error: '',
  };

  state = {
    open: false,
    value: '',
    needle: '',
    selected: 0,
    options: null,
  };

  private componentRef = createRef<HTMLDivElement>();

  private inputRef = createRef<HTMLInputElement>();

  private searchInputRef = createRef<HTMLInputElement>();

  private scrollContainerRef = createRef<HTMLDivElement>();

  private activeOptionRef = createRef<HTMLDivElement>();

  private keyListener: any;

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.value && nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  componentDidUpdate() {
    const { open } = this.state;

    if (this.searchInputRef && this.searchInputRef.current) {
      if (open) {
        this.searchInputRef.current.focus();
      }
    }
  }

  componentDidMount() {
    if (this.inputRef && this.inputRef.current) {
      const { data } = this.props;

      if (data) {
        Object.keys(data).map(
          key => (this.inputRef.current!.dataset[key] = data[key]),
        );
      }
    }

    window.addEventListener('keydown', this.arrowKeysHandler.bind(this), false);
  }

  componentWillMount() {
    const { value } = this.props;

    if (this.componentRef && this.componentRef.current) {
      this.componentRef.current.removeEventListener(
        'keydown',
        this.keyListener,
      );
    }

    if (value) {
      this.setState({
        value,
      });
    }

    this.setFilter();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.arrowKeysHandler.bind(this));
  }

  setFilter(needle = '') {
    const { options } = this.props;

    let filteredOptions = {};
    if (needle) {
      Object.keys(options).map(key => {
        if (
          key.toLocaleLowerCase().startsWith(needle.toLocaleLowerCase()) ||
          options[key]
            .toLocaleLowerCase()
            .startsWith(needle.toLocaleLowerCase())
        ) {
          Object.assign(filteredOptions, {
            [`${key}`]: options[key],
          });
        }
      });
    } else {
      filteredOptions = options;
    }

    this.setState({
      needle,
      options: filteredOptions,
      selected: 0,
    });
  }

  select(key: string) {
    this.setState(() => ({
      value: key,
      open: false,
    }));

    this.setFilter();

    if (this.props.onChange) {
      this.props.onChange(key as any);
    }
  }

  arrowKeysHandler(e: KeyboardEvent) {
    const { selected, open, options } = this.state;

    if (!open) return;

    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }

    if (this.componentRef && this.componentRef.current) {
      if (e.keyCode === 38 && selected > 0) {
        this.setState((state: IState) => ({
          selected: state.selected - 1,
        }));
      } else if (
        e.keyCode === 40 &&
        selected < Object.keys(options!).length - 1
      ) {
        this.setState((state: IState) => ({
          selected: state.selected + 1,
        }));
      } else if (e.keyCode === 13) {
        this.select(Object.keys(options!)[selected]);
      }

      if (
        this.activeOptionRef &&
        this.activeOptionRef.current &&
        this.scrollContainerRef &&
        this.scrollContainerRef.current
      ) {
        const containerTopOffset = this.scrollContainerRef.current.offsetTop;
        const optionTopOffset = this.activeOptionRef.current.offsetTop;

        const topOffset = optionTopOffset - containerTopOffset;

        this.scrollContainerRef.current.scrollTop = topOffset - 35;
      }
    }

    switch (e.keyCode) {
      case 37:
      case 39:
      case 38:
      case 40: // Arrow keys
      case 32:
        break; // Space
      default:
        break; // do not block other keys
    }
  }

  render() {
    const {
      actionText,
      classes,
      className,
      defaultValue,
      disabled,
      error,
      id,
      inputClassName,
      name,
      label,
      showLabel,
      showSearch,
      onChange,
      required,
    } = this.props;

    const { open, needle, value, selected, options } = this.state;

    let selection = '';
    if (!value && defaultValue && options![defaultValue]) {
      selection = options![defaultValue];
    } else if (value && options![value]) {
      selection = options![value];
    } else {
      selection = actionText;
    }

    return (
      <Wrapper className={className} identifier="franz-select">
        <Label
          title={label}
          showLabel={showLabel}
          htmlFor={id}
          className={classes.label}
          isRequired={required}
        >
          <div
            className={classnames({
              [`${classes.hasError}`]: error,
              [`${classes.disabled}`]: disabled,
            })}
            ref={this.componentRef}
          >
            <button
              type="button"
              className={classnames({
                [`${inputClassName}`]: inputClassName,
                [`${classes.select}`]: true,
                [`${classes.hasError}`]: error,
              })}
              onClick={
                !disabled
                  ? () =>
                      this.setState((state: IState) => ({
                        open: !state.open,
                      }))
                  : () => {}
              }
            >
              {selection}
              <Icon
                path={mdiArrowRightDropCircleOutline}
                size={0.8}
                className={classnames({
                  [`${classes.toggle}`]: true,
                  [`${classes.toggleOpened}`]: open,
                })}
              />
            </button>
            {showSearch && open && (
              <div className={classes.searchContainer}>
                <Icon path={mdiMagnify} size={0.8} />
                <input
                  type="text"
                  value={needle}
                  onChange={e => this.setFilter(e.currentTarget.value)}
                  placeholder="Search"
                  className={classes.search}
                  ref={this.searchInputRef}
                />
                {needle && (
                  <button
                    type="button"
                    className={classes.clearNeedle}
                    onClick={() => this.setFilter()}
                  >
                    <Icon path={mdiCloseCircle} size={0.7} />
                  </button>
                )}
              </div>
            )}
            <div
              className={classnames({
                [`${classes.popup}`]: true,
                [`${classes.open}`]: open,
              })}
              ref={this.scrollContainerRef}
            >
              {Object.keys(options!).map((key, i) => (
                <div
                  key={key}
                  onClick={() => this.select(key)}
                  className={classnames({
                    [`${classes.option}`]: true,
                    [`${classes.selected}`]: options![key] === selection,
                    [`${classes.focused}`]: selected === i,
                  })}
                  onMouseOver={() => this.setState({ selected: i })}
                  ref={selected === i ? this.activeOptionRef : null}
                >
                  {options![key]}
                </div>
              ))}
            </div>
          </div>
          <input
            className={classes.input}
            id={id}
            name={name}
            type="hidden"
            defaultValue={value}
            onChange={onChange}
            disabled={disabled}
            ref={this.inputRef}
          />
        </Label>
        {error && <Error message={error} />}
      </Wrapper>
    );
  }
}

export const Select = injectStyle(styles)(SelectComponent);
