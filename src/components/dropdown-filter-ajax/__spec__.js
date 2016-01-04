import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import DropdownFilterAjax from './dropdown-filter-ajax';
import Immutable from 'immutable';

describe('DropdownFilterAjax', () => {
  let instance;

  beforeEach(() => {
    instance = TestUtils.renderIntoDocument(
      <DropdownFilterAjax name="foo" value="1" path="/foobar" />
    );
  });

  describe('constructor', () => {
    it('sets default class properties', () => {
      expect(instance.listeningToScroll).toBeTruthy();
    });

    it('sets default state', () => {
      expect(instance.state.options).toEqual([]);
      expect(instance.state.page).toEqual(1);
      expect(instance.state.pages).toEqual(0);
    });
  });

  describe('handleVisibleChange', () => {
    it('calls getData', () => {
      spyOn(instance, 'getData');
      instance.handleVisibleChange({ target: { value: 'foo' }});
      expect(instance.getData).toHaveBeenCalledWith('foo', 1);
    });
  });

  describe('handleFocus', () => {
    beforeEach(() => {
      spyOn(instance, 'getData');
    });

    describe('if suggest is enabled', () => {
      it('does not call getData', () => {
        instance = TestUtils.renderIntoDocument(
          <DropdownFilterAjax name="foo" value="1" path="/foobar" suggest={ true } />
        );
        spyOn(instance, 'getData');
        instance.handleFocus();
        expect(instance.getData).not.toHaveBeenCalled();
      });
    });

    describe('if suggest is disabled', () => {
      it('calls getData', () => {
        instance.handleFocus();
        expect(instance.getData).toHaveBeenCalledWith("", 1);
      });
    });

    it('calls setSelectionRange', () => {
      spyOn(instance.refs.input, 'setSelectionRange');
      instance.handleFocus();
      expect(instance.refs.input.setSelectionRange).toHaveBeenCalledWith(0, instance.refs.input.value.length);
    });
  });

  describe('handleScroll', () => {
    beforeEach(() => {
      spyOn(instance, 'getData');
    });

    describe('if not listeningToScroll', () => {
      it('does not get data', () => {
        instance.listeningToScroll = false;
        instance.setState({ open: true });
        TestUtils.Simulate.scroll(instance.refs.list);
        expect(instance.getData).not.toHaveBeenCalled();
      });
    });

    describe('if listeningToScroll', () => {
      beforeEach(() => {
        instance.listeningToScroll = true;
      });

      describe('if page is greater than pages', () => {
        it('does not get data', () => {
          instance.setState({ page: 2, pages: 1 });
          instance.handleScroll();
          expect(instance.getData).not.toHaveBeenCalled();
        });
      });

      describe('if page is less than pages', () => {
        beforeEach(() => {
          instance.setState({ page: 1, pages: 2 });
        });

        describe('if scroll top is less than scroll trigger position', () => {
          it('does not get data', () => {
            instance.refs.list = {
              scrollHeight: 200,
              offsetHeight: 75,
              scrollTop: 100
            };
            instance.handleScroll();
            expect(instance.getData).not.toHaveBeenCalled();
          });
        });

        describe('if scroll top is more than scroll trigger position', () => {
          it('calls get data', () => {
            instance.refs.list = {
              scrollHeight: 200,
              offsetHeight: 76,
              scrollTop: 100
            };
            instance.handleScroll();
            expect(instance.getData).toHaveBeenCalledWith(instance.state.visibleValue, instance.state.page + 1);
          });
        });
      });
    });
  });

  describe('getData', () => {
    beforeEach(() => {
      jasmine.Ajax.install();
    });

    afterEach(() => {
      jasmine.Ajax.uninstall();
    });

    describe('if data is not explicitly passed', () => {
      it('calls the correct query', () => {
        instance.getData();
        let request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toEqual("/foobar?page=1&rows=25&value=");
      });
    });

    describe('if data not explicitly passed', () => {
      it('calls the correct query', () => {
        instance.getData("foo", 1);
        let request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toEqual("/foobar?page=1&rows=25&value=foo");
      });

      it('calls updateList on success', () => {
        spyOn(instance, 'updateList');
        instance.getData("foo", 1);
        let request = jasmine.Ajax.requests.mostRecent();
        request.respondWith({
          "status": 200,
          "contentType": 'application/json',
          "responseText": "{\"data\": [\"foo\"]}"
        });
        expect(instance.updateList).toHaveBeenCalledWith('foo');
      });
    });
  });

  describe('resetScroll', () => {
    it('sets listeningToScroll to false', () => {
      instance.listeningToScroll = true;
      instance.resetScroll();
      expect(instance.listeningToScroll).toBeFalsy();
    });

    describe('when list exists', () => {
      it('should reset the scroll top', () => {
        instance.refs.list = {
          scrollTop: 100
        };
        instance.resetScroll();
        expect(instance.refs.list.scrollTop).toEqual(0);
      });
    });
  });

  describe('updateList', () => {
    beforeEach(() => {
      instance.setState({ options: [0] });
      spyOn(instance, 'setState');
      spyOn(instance, 'resetScroll');
    });

    describe('if page is greater than 1', () => {
      it('concats lists', () => {
        instance.updateList({ records: 100, items: [1], page: 2 });
        expect(instance.setState).toHaveBeenCalledWith({
          open: true,
          options: [0,1],
          page: 2,
          pages: 4
        });
      });
    });

    describe('if page is 1 or less', () => {
      it('calls resetScroll', () => {
        instance.updateList({ records: 100, items: [1], page: 1 });
        expect(instance.resetScroll).toHaveBeenCalled();
      });
    });

    it('calls setState', () => {
      instance.updateList({ records: 100, items: [1], page: 1 });
      expect(instance.setState).toHaveBeenCalledWith({
        open: true,
        options: [1],
        page: 1,
        pages: 4
      });
    });

    it('sets listeningToScroll to true', () => {
      instance.listeningToScroll = false;
      instance.updateList([]);
      expect(instance.listeningToScroll).toBeTruthy();
    });
  });

  describe('defaultHighlighted', () => {
    it('returns null', () => {
      expect(instance.defaultHighlighted).toBe(null);
    });
  });

  describe('options', () => {
    it('calls prepareList', () => {
      spyOn(instance, 'prepareList');
      instance.options;
      expect(instance.prepareList).toHaveBeenCalled();
    });
  });

  describe('inputProps', () => {
    describe('when value is not a string', () => {
      it('uses the visibleValue', () => {
        instance = TestUtils.renderIntoDocument(
          <DropdownFilterAjax name="foo" value="1" path="/foobar" visibleValue="bar" />
        );
        instance.visibleValue = null;
        expect(instance.inputProps.value).toEqual('bar');
      });
    });

    describe('when value is a string', () => {
      it('uses the value from inputProps', () => {
        instance = TestUtils.renderIntoDocument(
          <DropdownFilterAjax name="foo" path="/foobar" visibleValue="bar" />
        );
        instance.visibleValue = 'foo';
        expect(instance.inputProps.value).toEqual('foo');
      });
    });
  });
});
