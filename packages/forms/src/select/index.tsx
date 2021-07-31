import {
  mdiArrowRightDropCircleOutline,
  mdiCloseCircle,
  mdiMagnify,
} from '@mdi/js';
import Icon from '@mdi/react';
import classnames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';

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

const useStyles = createUseStyles((theme: Theme) => ({
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
    transition: 'all 0.3s',
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
    transition: 'transform 0.3s',
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
}));

export const Select = ({
  onChange = () => {},
  showLabel = true,
  disabled = false,
  error = '',
  data,
  value,
  actionText,
  className,
  defaultValue,
  id,
  inputClassName,
  name,
  label,
  showSearch,
  required,
}: IProps) => {
  const [open, setOpen] = useState<boolean>(false);
  // const [value, setValue] = useState<string>('');
  const [needle, setNeedle] = useState<string>('');
  const [selected, setSelected] = useState<number>(0);
  const [options, setOptions] = useState<IOptions>({});

  const componentRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeOptionRef = useRef<HTMLDivElement>(null);

  const keyListener: any = null;

  const setFilter = useCallback(
    (needle = '') => {
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

      setNeedle(needle);
      setOptions(filteredOptions);
      setSelected(0);
    },
    [options],
  );

  const select = (key: string) => {
    // setValue(key);
    setOpen(false);

    setFilter();

    if (onChange) {
      onChange(key as any);
    }
  };

  const arrowKeysHandler = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      if (e.keyCode === 38 || e.keyCode === 40) {
        e.preventDefault();
      }

      if (componentRef && componentRef.current) {
        if (e.keyCode === 38 && selected > 0) {
          setSelected(selected - 1);
        } else if (
          e.keyCode === 40 &&
          selected < Object.keys(options!).length - 1
        ) {
          setSelected(selected + 1);
        } else if (e.keyCode === 13) {
          select(Object.keys(options!)[selected]);
        }

        if (
          activeOptionRef &&
          activeOptionRef.current &&
          scrollContainerRef &&
          scrollContainerRef.current
        ) {
          const containerTopOffset = scrollContainerRef.current.offsetTop;
          const optionTopOffset = activeOptionRef.current.offsetTop;

          const topOffset = optionTopOffset - containerTopOffset;

          scrollContainerRef.current.scrollTop = topOffset - 35;
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
    },
    [open, options, select, selected],
  );

  useEffect(() => {
    if (searchInputRef && searchInputRef.current) {
      if (open) {
        searchInputRef.current.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    if (componentRef && componentRef.current) {
      componentRef.current.removeEventListener('keydown', keyListener);
    }

    // if (value) {
    //   setValue(value);
    // }

    setFilter();
  }, [keyListener, setFilter]);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      if (data) {
        Object.keys(data).map(
          key => (inputRef.current!.dataset[key] = data[key]),
        );
      }
    }

    return () => {
      window.removeEventListener('keydown', arrowKeysHandler);
    };
  }, [arrowKeysHandler, data]);

  const classes = useStyles();

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
          ref={componentRef}
        >
          <button
            type="button"
            className={classnames({
              [`${inputClassName}`]: inputClassName,
              [`${classes.select}`]: true,
              [`${classes.hasError}`]: error,
            })}
            onClick={!disabled ? () => setOpen(!open) : () => {}}
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
                onChange={e => setFilter(e.currentTarget.value)}
                placeholder="Search"
                className={classes.search}
                ref={searchInputRef}
              />
              {needle && (
                <button
                  type="button"
                  className={classes.clearNeedle}
                  onClick={() => setFilter()}
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
            ref={scrollContainerRef}
          >
            {Object.keys(options!).map((key, i) => (
              <div
                key={key}
                onClick={() => select(key)}
                className={classnames({
                  [`${classes.option}`]: true,
                  [`${classes.selected}`]: options![key] === selection,
                  [`${classes.focused}`]: selected === i,
                })}
                onMouseOver={() => setSelected(i)}
                ref={selected === i ? activeOptionRef : null}
              >
                {options![key]}
              </div>
            ))}
          </div>
        </div>
        <input
          // className={classes.input}
          id={id}
          name={name}
          type="hidden"
          defaultValue={value}
          onChange={onChange}
          disabled={disabled}
          ref={inputRef}
        />
      </Label>
      {error && <Error message={error} />}
    </Wrapper>
  );
};
