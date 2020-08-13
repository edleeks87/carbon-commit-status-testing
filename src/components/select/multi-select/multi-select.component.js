import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import SelectTextbox, { formInputPropTypes } from '../select-textbox/select-textbox.component';
import guid from '../../../utils/helpers/guid';
import withFilter from '../utils/with-filter.hoc';
import SelectList from '../select-list/select-list.component';
import StyledMultiSelect from './multi-select.style';
import Pill from '../../pill';
import { StyledSelectPillContainer } from '../../../__experimental__/components/select/select.style';

const FilterableSelectList = withFilter(SelectList);

const MultiSelect = React.forwardRef(({
  value,
  defaultValue,
  id,
  name,
  disabled,
  readOnly,
  children,
  onOpen,
  onChange,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  openOnFocus = false,
  noResultsMessage,
  placeholder,
  ...textboxProps
}, inputRef) => {
  const selectListId = useRef(guid());
  const labelId = useRef(guid());
  const containerRef = useRef();
  const listboxRef = useRef();
  const isInputFocused = useRef(false);
  const isClickTriggeredBySelect = useRef(false);
  const isMouseDownReported = useRef(false);
  const isMouseDownOnInput = useRef(false);
  const isControlled = useRef(value !== undefined);
  const [textboxRef, setTextboxRef] = useState();
  const [isOpen, setOpenState] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [selectedValue, setSelectedValue] = useState([]);
  const [highlightedValue, setHighlightedValue] = useState('');
  const [filterText, setFilterText] = useState('');
  const [repositionTrigger, setRepositionTrigger] = useState(false);
  const [placeholderOverride, setPlaceholderOverride] = useState();

  const setOpen = useCallback(() => {
    setOpenState((isAlreadyOpen) => {
      if (!isAlreadyOpen && onOpen) {
        onOpen();
      }

      return true;
    });
  }, [onOpen]);

  const createCustomEvent = useCallback((newValue) => {
    const customEvent = {
      target: {
        ...(name && { name }),
        ...(id && { id }),
        value: newValue
      }
    };

    return customEvent;
  }, [name, id]);

  const handleTextboxChange = useCallback((event) => {
    const newValue = event.target.value;
    const match = findElementWithMatchingText(newValue, children);

    if (match) {
      setHighlightedValue(match.props.value);
    }

    setFilterText(newValue);
    setTextValue(newValue);
    setOpen();
  }, [children, setOpen]);

  const handleTextboxKeydown = useCallback(((event) => {
    const { key } = event;
    const isDeleteKey = key === 'Backspace' || key === 'Delete';

    if (onKeyDown) {
      onKeyDown(event);
    }

    if (!event.defaultPrevented && isNavigationKey(key)) {
      event.preventDefault();
      setOpen();
    }

    if (isDeleteKey && (filterText === '' || textValue === '')) {
      removeSelectedValue(-1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [filterText, textValue, onKeyDown, setOpen]);

  const handleGlobalClick = useCallback((event) => {
    isMouseDownReported.current = false;

    if (!isOpen) {
      return;
    }

    const notInContainer = containerRef.current && !containerRef.current.contains(event.target);

    if (notInContainer && !isClickTriggeredBySelect.current) {
      setTextValue('');
      setFilterText('');
      setHighlightedValue('');
      setOpenState(false);
    }

    isClickTriggeredBySelect.current = false;
  }, [isOpen]);

  const mapValuesToPills = useCallback(() => {
    const canDelete = !disabled && !readOnly;

    if (selectedValue.length === 0) {
      return '';
    }

    return selectedValue.map((singleValue, index) => {
      const matchingOption = React.Children.toArray(children).find(option => (option.props.value === singleValue));

      return (
        <StyledSelectPillContainer key={ singleValue }>
          <Pill
            onDelete={ canDelete ? () => removeSelectedValue(index) : undefined }
            title={ matchingOption.props.text }
          >
            { matchingOption.props.text }
          </Pill>
        </StyledSelectPillContainer>
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, disabled, readOnly, selectedValue]);

  useEffect(() => {
    const newValue = value || defaultValue;
    const modeSwitchedMessage = 'Input elements should not switch from uncontrolled to controlled (or vice versa). '
    + 'Decide between using a controlled or uncontrolled input element for the lifetime of the component';
    const onChageMissingMessage = 'onChange prop required when using a controlled input element';

    invariant(isControlled.current === (value !== undefined), modeSwitchedMessage);
    invariant(!isControlled.current || (isControlled.current && onChange), onChageMissingMessage);
    setSelectedValue((previousValue) => {
      if (!newValue && previousValue.length === 0) {
        return previousValue;
      }

      return newValue;
    });
  }, [value, defaultValue, onChange]);

  // removes placeholder when a value is present
  useEffect(() => {
    const hasValue = value && value.length > 0;
    const hasSelectedValue = selectedValue && selectedValue.length > 0;

    if (hasValue || hasSelectedValue) {
      setPlaceholderOverride(' ');
    } else {
      setPlaceholderOverride(placeholder);
    }
  }, [value, selectedValue, placeholder]);

  useEffect(() => {
    const clickEvent = 'click';

    document.addEventListener(clickEvent, handleGlobalClick);

    return function cleanup() {
      document.removeEventListener(clickEvent, handleGlobalClick);
    };
  }, [handleGlobalClick]);

  useEffect(() => {
    if (!isControlled.current && onChange) {
      onChange(createCustomEvent(selectedValue));
    }

    setRepositionTrigger((previousValue) => {
      return !previousValue;
    });
  }, [createCustomEvent, onChange, selectedValue]);

  function handleTextboxClick(event) {
    isMouseDownReported.current = false;

    if (onClick) {
      onClick(event);
    }
  }

  function handleDropdownIconClick(event) {
    isMouseDownReported.current = false;

    if (onClick) {
      onClick(event);
    }

    setOpenState((isAlreadyOpen) => {
      if (isAlreadyOpen) {
        setFilterText('');
        return false;
      }

      if (onOpen) {
        onOpen();
      }

      return true;
    });
  }

  function handleTextboxBlur(event) {
    isMouseDownOnInput.current = false;

    if (isMouseDownReported.current) {
      return;
    }

    isInputFocused.current = false;

    if (onBlur) {
      onBlur(event);
    }
  }

  function handleTextboxMouseDown(event) {
    isMouseDownReported.current = true;

    if (event.target.attributes['data-element'].value === 'input') {
      isMouseDownOnInput.current = true;
    }
  }

  function handleListMouseDown() {
    isMouseDownReported.current = true;
  }

  function handleTextboxFocus(event) {
    const triggerFocus = () => onFocus(event);

    if (openOnFocus) {
      setOpenState((isAlreadyOpen) => {
        if (isAlreadyOpen) {
          return true;
        }

        if (onOpen) {
          onOpen();
        }
        if (onFocus && !isInputFocused.current) {
          triggerFocus();
          isInputFocused.current = true;
        }

        if (isMouseDownReported.current && !isMouseDownOnInput.current) {
          return false;
        }

        return true;
      });
    } else if (onFocus && !isInputFocused.current) {
      triggerFocus();
      isInputFocused.current = true;
    }
  }

  const onSelectOption = useCallback((optionData) => {
    const { value: newValue, selectionType } = optionData;

    if (selectionType === 'navigationKey') {
      setHighlightedValue('');

      return;
    }

    if (selectionType === 'click') {
      isClickTriggeredBySelect.current = true;
    }

    setTextValue('');
    setSelectedValue((previousValue) => {
      textboxRef.focus();
      isMouseDownReported.current = false;

      if (previousValue.findIndex(val => val === newValue) !== -1) {
        return previousValue;
      }

      const valueList = [...previousValue, newValue];

      if (isControlled.current && onChange) {
        onChange(createCustomEvent(valueList));

        return previousValue;
      }

      return valueList;
    });
  }, [createCustomEvent, onChange, textboxRef]);

  function onSelectListClose() {
    setOpenState(false);
    setTextValue('');
    setFilterText('');
  }

  function findElementWithMatchingText(textToMatch, list) {
    return list.find((child) => {
      const { text } = child.props;

      return text && text.toLowerCase().indexOf(textToMatch.toLowerCase()) !== -1;
    });
  }

  function removeSelectedValue (index) {
    setSelectedValue((previousValue) => {
      if (previousValue.length === 0) {
        return previousValue;
      }

      const newValue = [...previousValue];
      newValue.splice(index, 1);

      if (isControlled.current && onChange) {
        onChange(createCustomEvent(newValue));

        return previousValue;
      }

      return newValue;
    });
  }

  function assignInput(input) {
    setTextboxRef(input.current);

    if (inputRef) {
      inputRef.current = input.current;
    }
  }

  function getTextboxProps() {
    return {
      id,
      name,
      disabled,
      readOnly,
      placeholder: placeholderOverride,
      leftChildren: mapValuesToPills(),
      inputRef: assignInput,
      formattedValue: textValue,
      selectedValue,
      onClick: handleTextboxClick,
      onMouseDown: handleTextboxMouseDown,
      onFocus: handleTextboxFocus,
      onBlur: handleTextboxBlur,
      iconOnClick: handleDropdownIconClick,
      onKeyDown: handleTextboxKeydown,
      onChange: handleTextboxChange,
      ...textboxProps
    };
  }

  function isNavigationKey(key) {
    return key === 'ArrowDown' || key === 'ArrowUp'
    || key === 'Home' || key === 'End';
  }

  return (
    <StyledMultiSelect
      data-component='multiselect'
      aria-expanded={ isOpen }
      aria-haspopup='listbox'
      ref={ containerRef }
    >
      <SelectTextbox
        aria-controls={ isOpen ? selectListId.current : '' }
        type='text'
        labelId={ labelId.current }
        { ...getTextboxProps() }
      />
      { isOpen && (
        <FilterableSelectList
          ref={ listboxRef }
          aria-multiselectable
          id={ selectListId.current }
          labelId={ labelId.current }
          anchorElement={ textboxRef.parentElement }
          onSelect={ onSelectOption }
          onSelectListClose={ onSelectListClose }
          onMouseDown={ handleListMouseDown }
          filterText={ filterText }
          highlightedValue={ highlightedValue }
          noResultsMessage={ noResultsMessage }
          repositionTrigger={ repositionTrigger }
        >
          { children }
        </FilterableSelectList>
      ) }
    </StyledMultiSelect>
  );
});

MultiSelect.propTypes = {
  ...formInputPropTypes,
  /** The selected value(s), when the component is operating in controlled mode */
  value: PropTypes.arrayOf(PropTypes.string),
  /** The default selected value(s), when the component is operating in uncontrolled mode */
  defaultValue: PropTypes.arrayOf(PropTypes.string),
  /** Child components (such as Option) for the SelectList */
  children: PropTypes.node.isRequired,
  /** A custom callback for when the dropdown menu opens */
  onOpen: PropTypes.func,
  /** If true the Component opens on focus */
  openOnFocus: PropTypes.bool,
  /** A custom message to be displayed when any option does not match the filter text */
  noResultsMessage: PropTypes.string
};

export default MultiSelect;