import React, { useRef } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import FilterableSelect from './filterable-select.component';
import Textbox from '../../../__experimental__/components/textbox';
import Option from '../option/option.component';
import SelectList from '../select-list/select-list.component';

describe('FilterableSelect', () => {
  it('the Textbox should have type of "text"', () => {
    const wrapper = renderSelect();

    expect(wrapper.find(Textbox).prop('type')).toBe('text');
  });

  it('the input ref should be forwarded', () => {
    let mockRef;

    const WrapperComponent = () => {
      mockRef = useRef();

      return (
        <FilterableSelect
          name='testSelect'
          id='testSelect'
          ref={ mockRef }
        >
          <Option value='opt1' text='red' />
          <Option value='opt2' text='green' />
          <Option value='opt3' text='blue' />
          <Option value='opt4' text='black' />
        </FilterableSelect>
      );
    };

    const wrapper = mount(<WrapperComponent />);

    expect(mockRef.current).toBe(wrapper.find('input').getDOMNode());
  });

  describe('when the value prop has been passed', () => {
    it('then the formatted value should be set to corresponding option text', () => {
      const wrapper = renderSelect({ value: 'opt2', onChange: jest.fn() });

      expect(wrapper.find(Textbox).prop('formattedValue')).toBe('green');
    });
  });

  describe('when the inputRef function prop is specified', () => {
    it('then the input reference should be returned on call', () => {
      const inputRefFn = jest.fn();
      const wrapper = renderSelect({ inputRef: inputRefFn });

      expect(inputRefFn).toHaveBeenCalledWith({ current: wrapper.find('input').getDOMNode() });
    });
  });

  describe('when the onFocus prop has been passed and the input has been focused', () => {
    it('then that prop should be called', () => {
      const onFocusFn = jest.fn();
      const wrapper = renderSelect({ onFocus: onFocusFn });

      wrapper.find('input').simulate('focus');
      expect(onFocusFn).toHaveBeenCalled();
    });
  });

  describe('when the Textbox Input is focused', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = renderSelect();
    });

    it('the SelectList should not be rendered', () => {
      wrapper.find('input').simulate('focus');
      expect(wrapper.find(SelectList).exists()).toBe(false);
    });

    describe.each([
      'ArrowDown',
      'ArrowUp',
      'Home',
      'End'
    ])('and %s key has been pressed', (key) => {
      it('the SelectList should be rendered', () => {
        wrapper.find('input').simulate('keydown', { key });
        expect(wrapper.update().find(SelectList).exists()).toBe(true);
      });
    });

    describe('and the Enter key has been pressed', () => {
      it('the SelectList should not be rendered', () => {
        wrapper.find('input').simulate('keydown', { key: 'Enter' });
        expect(wrapper.find(SelectList).exists()).toBe(false);
      });
    });

    describe('and a key that matches the last character has been pressed', () => {
      it('the filterText prop in the SelectList should match the formattedValue in the Textbox', () => {
        wrapper.find('input').simulate('change', { target: { value: 'blu' } });
        wrapper.find('input').simulate('keydown', { key: 'e' });

        const selectList = wrapper.find(SelectList);
        const textbox = wrapper.find(Textbox);
        expect(selectList.prop('filterText')).toBe(textbox.prop('formattedValue'));
      });
    });
  });

  describe('when the Textbox Input has been clicked', () => {
    it('the SelectList should not be rendered', () => {
      const wrapper = renderSelect();

      wrapper.find('input').simulate('click');
      expect(wrapper.find(SelectList).exists()).toBe(false);
    });

    describe.each(['disabled', 'readOnly'])('and the %s prop is set to true', (prop) => {
      it('then the "onClick" prop should not be called', () => {
        const onClickFn = jest.fn();
        const wrapper = renderSelect({ onClick: onClickFn, [prop]: true });

        wrapper.find('input').simulate('click');
        expect(onClickFn).not.toHaveBeenCalled();
      });

      it('then the SelectList should not be rendered', () => {
        const wrapper = renderSelect({ [prop]: true });

        wrapper.find('input').simulate('click');
        expect(wrapper.find(SelectList).exists()).toBe(false);
      });
    });

    describe('and the onClick prop is passed', () => {
      it('then that prop should be called', () => {
        const onClickFn = jest.fn();
        const wrapper = renderSelect({ onClick: onClickFn });

        wrapper.find('input').simulate('click');
        expect(onClickFn).toHaveBeenCalled();
      });
    });

    describe('when the Dropdown Icon in the Textbox has been clicked', () => {
      it('the SelectList should be rendered', () => {
        const wrapper = renderSelect();

        wrapper.find(Textbox).find('[type="dropdown"]').first().simulate('click');
        expect(wrapper.find(SelectList).exists()).toBe(true);
      });

      describe('twice', () => {
        it('the SelectList should not be rendered', () => {
          const wrapper = renderSelect();
          const dropdown = wrapper.find(Textbox).find('[type="dropdown"]').first();
          dropdown.simulate('click');
          dropdown.simulate('click');
          expect(wrapper.find(SelectList).exists()).toBe(false);
        });
      });

      describe('and the onOpen prop is passed', () => {
        it('then that prop should be called', () => {
          const onOpenFn = jest.fn();
          const wrapper = renderSelect({ onOpen: onOpenFn });

          wrapper.find(Textbox).find('[type="dropdown"]').first().simulate('click');
          expect(onOpenFn).toHaveBeenCalled();
        });
      });

      describe('and the onClick prop is passed', () => {
        it('then that prop should be called', () => {
          const onClickFn = jest.fn();
          const wrapper = renderSelect({ onClick: onClickFn });

          wrapper.find(Textbox).find('[type="dropdown"]').first().simulate('click');
          expect(onClickFn).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when a printable character has been typed in the Textbox', () => {
    describe('and the first filtered option starts with that character', () => {
      it('then the visible value should be changed to that option text', () => {
        const wrapper = renderSelect();

        wrapper.find('input').simulate('change', { target: { value: 'r' } });
        wrapper.update();
        expect(wrapper.find(Textbox).prop('formattedValue')).toBe('red');
        wrapper.unmount();
      });
    });

    describe('and the first filtered option does not start with that character', () => {
      it('then the Textbox visible value should be changed to that character', () => {
        const wrapper = renderSelect();

        wrapper.find('input').simulate('change', { target: { value: 'l' } });
        wrapper.update();
        expect(wrapper.find(Textbox).prop('formattedValue')).toBe('l');
        wrapper.unmount();
      });

      it('then the Textbox value should be the value of the first option containing that character', () => {
        const wrapper = renderSelect();

        wrapper.find('input').simulate('change', { target: { value: 'l' } });
        wrapper.update();
        expect(wrapper.find(Textbox).prop('value')).toBe('opt3');
        wrapper.unmount();
      });
    });

    it('the SelectList should have the filterText prop the same as the value', () => {
      const changeEventObject = { target: { value: 'Foo' } };
      const wrapper = renderSelect();

      wrapper.find('input').simulate('click');
      wrapper.find('input').simulate('change', changeEventObject);
      expect(wrapper.update().find(SelectList).prop('filterText')).toBe('Foo');
    });


    describe('with the onOpen prop passed', () => {
      it('then that prop should be called', () => {
        const onOpenFn = jest.fn();
        const wrapper = renderSelect({ onOpen: onOpenFn });

        wrapper.find('input').simulate('change', { target: { value: 'b' } });

        expect(onOpenFn).toHaveBeenCalled();
      });
    });
  });

  describe('when the onSelect is called in the open SelectList', () => {
    const navigationKeyOptionObject = {
      value: 'Foo',
      text: 'Bar',
      selectionType: 'navigationKey'
    };
    const clickOptionObject = {
      value: 'Foo',
      text: 'Bar',
      selectionType: 'click'
    };
    const textboxProps = {
      name: 'testName',
      id: 'testId'
    };
    const expectedEventObject = {
      target: {
        ...textboxProps,
        value: 'Foo'
      }
    };

    describe('with "selectionType" as "click"', () => {
      it('the SelectList should be closed', () => {
        const wrapper = renderSelect();

        wrapper.find(Textbox).find('[type="dropdown"]').first().simulate('click');
        expect(wrapper.find(SelectList).exists()).toBe(true);
        act(() => {
          wrapper.find(SelectList).prop('onSelect')(clickOptionObject);
        });
        expect(wrapper.update().find(SelectList).exists()).toBe(false);
      });
    });

    describe('with "selectionType" as "navigationKey"', () => {
      it('the SelectList should be open and the value should be selected', () => {
        const wrapper = renderSelect();

        wrapper.find(Textbox).find('[type="dropdown"]').first().simulate('click');
        expect(wrapper.find(SelectList).exists()).toBe(true);
        act(() => {
          wrapper.find(SelectList).prop('onSelect')(navigationKeyOptionObject);
        });
        wrapper.update();
        expect(wrapper.find(SelectList).exists()).toBe(true);
        expect(wrapper.find(Textbox).prop('value')).toBe('Foo');
        expect(wrapper.find(Textbox).prop('formattedValue')).toBe('Bar');
      });
    });

    describe('and the onChange prop is passed', () => {
      it('then that prop should be called with the same value', () => {
        const onChangeFn = jest.fn();
        const wrapper = renderSelect({ ...textboxProps, onChange: onChangeFn });

        wrapper.find(Textbox).find('[type="dropdown"]').first().simulate('click');
        act(() => {
          wrapper.find(SelectList).prop('onSelect')(clickOptionObject);
        });
        expect(onChangeFn).toHaveBeenCalledWith(expectedEventObject);
      });
    });
  });

  describe('when the onSelectListClose is called in the open SelectList', () => {
    it('the SelectList should be closed', () => {
      const wrapper = renderSelect();

      wrapper.find(Textbox).find('[type="dropdown"]').first().simulate('click');
      expect(wrapper.find(SelectList).exists()).toBe(true);
      act(() => {
        wrapper.find(SelectList).prop('onSelectListClose')();
      });
      expect(wrapper.update().find(SelectList).exists()).toBe(false);
    });

    describe('and the visible text was changed', () => {
      it('then the formattedValue prop in Textbox should be reverted to previous value', () => {
        const selectedOptionTextValue = 'green';
        const onChangeFn = jest.fn();
        const wrapper = renderSelect({ onChange: onChangeFn, defaultValue: 'opt2' });
        const changeEventObject = { target: { value: 'Foo' } };

        wrapper.find(Textbox).find('[type="dropdown"]').first().simulate('click');
        expect(wrapper.find(Textbox).prop('formattedValue')).toBe(selectedOptionTextValue);
        wrapper.find('input').simulate('change', changeEventObject);
        expect(wrapper.find(Textbox).prop('formattedValue')).toBe('Foo');
        act(() => {
          wrapper.find(SelectList).prop('onSelectListClose')();
        });
        expect(wrapper.update().find(Textbox).prop('formattedValue')).toBe(selectedOptionTextValue);
      });
    });
  });

  describe('when an HTML element is clicked when the SelectList is open', () => {
    let wrapper;
    let domNode;

    beforeEach(() => {
      wrapper = mount(getSelect());
      domNode = wrapper.getDOMNode();
      document.body.appendChild(domNode);
    });

    describe('and that element is the input', () => {
      it('then the SelectList should stay open', () => {
        wrapper.find(Textbox).find('[type="dropdown"]').first().simulate('click');
        expect(wrapper.find(SelectList).exists()).toBe(true);
        act(() => {
          wrapper.find('input').getDOMNode().dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
        expect(wrapper.update().find(SelectList).exists()).toBe(true);
      });
    });

    describe('and that element is not part of the Select', () => {
      it('then the SelectList should be closed', () => {
        wrapper.find(Textbox).find('[type="dropdown"]').first().simulate('click');
        expect(wrapper.find(SelectList).exists()).toBe(true);
        act(() => {
          document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
        expect(wrapper.update().find(SelectList).exists()).toBe(false);
      });
    });

    afterEach(() => {
      document.body.removeChild(domNode);
    });
  });
});


describe('when the onKeyDown prop is passed', () => {
  const expectedEventObject = {
    key: 'ArrowDown'
  };

  it('then when a key is pressed, that prop should be called with expected values', () => {
    const onKeyDownFn = jest.fn();
    const wrapper = renderSelect({ onKeyDown: onKeyDownFn });

    wrapper.find('input').simulate('keyDown', expectedEventObject);

    expect(onKeyDownFn).toHaveBeenCalledWith(expect.objectContaining({
      ...expectedEventObject
    }));
  });
});

describe('when the component is controlled', () => {
  const expectedObject = {
    target: {
      id: 'testSelect',
      name: 'testSelect',
      value: 'opt3'
    }
  };

  const clickOptionObject = {
    value: 'opt3',
    text: 'black',
    selectionType: 'click'
  };

  describe('and an option is selected', () => {
    it('then the onChange prop should be called with expected value', () => {
      const onChangeFn = jest.fn();
      const wrapper = renderSelect({ onChange: onChangeFn, value: 'opt1' });

      wrapper.find(Textbox).find('[type="dropdown"]').first().simulate('click');
      expect(wrapper.find(SelectList).exists()).toBe(true);
      act(() => {
        wrapper.find(SelectList).prop('onSelect')(clickOptionObject);
      });
      expect(onChangeFn).toHaveBeenCalledWith(expectedObject);
    });
  });

  describe('when a printable character has been typed in the Textbox', () => {
    let onChangeFn;
    let wrapper;

    beforeEach(() => {
      onChangeFn = jest.fn();
      wrapper = renderSelect({ onChange: onChangeFn, value: 'opt1' });
      wrapper.find('input').simulate('change', { target: { value: 'b' } });
      wrapper.update();
    });

    it('then the onChange function should have been called with with the expected value', () => {
      expect(onChangeFn).toHaveBeenCalledWith(expectedObject);
    });
  });
});

function renderSelect(props = {}, renderer = mount) {
  return renderer(getSelect(props));
}

function getSelect(props) {
  return (
    <FilterableSelect
      name='testSelect'
      id='testSelect'
      { ...props }
    >
      <Option value='opt1' text='red' />
      <Option value='opt2' text='green' />
      <Option value='opt3' text='blue' />
      <Option value='opt4' text='black' />
    </FilterableSelect>
  );
}