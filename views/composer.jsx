var Composer = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    btw: React.PropTypes.string,
    defaultValue: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onChange: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      error: null,
      id: 'input-' + window.createGUID(),
      form: null,
      disabled: false
    };
  },
  componentDidMount: function() {
    var component = this;
    if (component.refs.label) {
      $(component.refs.label.getDOMNode()).click(component.focus);
    }
    $(component.refs.input.getDOMNode()).text(component.props.defaultValue);
    $(component.refs.input.getDOMNode()).change(function(event) {
      component.setState({ error: null });

      var range = component.getSelectionRange();
      $(component.refs.input.getDOMNode()).text($(component.refs.input.getDOMNode()).text());
      component.setSelectionRange(range.start, range.end);

      if (component.props.onChange) {
        component.props.onChange(event);
      }

      if (component.state.form) {
        component.state.form.clearFormError();
      }

      return true;
    });
  },
  setForm: function(form) {
    this.setState({ form: form });
  },
  getSelectionRange: function() {
    var selection = rangy.getSelection();
    var ranges = selection.getAllRanges();
    if (ranges.length > 0) {
      var recurse = function(root) {
        var start = null;
        var end = null;

        if (root.parentNode === ranges[0].startContainer.parentNode &&
          root.previousSibling === ranges[0].startContainer.previousSibling) {
          start = ranges[0].startOffset;
        }
        if (root.parentNode === ranges[0].endContainer.parentNode &&
          root.previousSibling === ranges[0].endContainer.previousSibling) {
          end = ranges[0].endOffset;
        }

        var contents = $(root).contents();
        if (contents.length === 0) {
          if (root.nodeType === 3) {
            return [start, end, root.length];
          } else {
            return [start, end, $(root).html().length];
          }
        }

        var length = 0;
        contents.each(function(index, element) {
          var result = recurse(element);
          if (result[0] !== null) {
            start = length + result[0];
          }
          if (result[1] !== null) {
            end = length + result[1];
          }
          length += result[2];
        });

        return [start, end, length];
      };
      var r = recurse(this.refs.input.getDOMNode());
      return { start: r[0], end: r[1] };
    } else {
      return { start: null, end: null };
    }
  },
  setSelectionRange: function(start, end) {
    if (start === null || end === null) {
      return;
    }

    var range = rangy.createRange();
    range.setStart(this.refs.input.getDOMNode(), 0);
    range.setEnd(this.refs.input.getDOMNode(), 0);

    var recurse = function(root) {
      var contents = $(root).contents();
      if (contents.length === 0) {
        var length = 0;
        if (root.nodeType === 3) {
          length = root.length;
        } else {
          length = $(root).html().length;
        }
        if (start > length) {
          start -= length;
          range.setStart(root, length);
        } else if (start > 0 && start <= length) {
          range.setStart(root, start);
          start = 0;
        }
        if (end > length) {
          end -= length;
          range.setEnd(root, length);
        } else if (end > 0 && end <= length) {
          range.setEnd(root, end);
          end = 0;
        }
      }

      contents.each(function(index, element) {
        recurse(element);
      });
    };
    recurse(this.refs.input.getDOMNode());

    var selection = rangy.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  },
  setDisabled: function(disabled) {
    this.setState({ disabled: disabled });
  },
  focus: function() {
    return $(this.refs.input.getDOMNode()).focus();
  },
  setError: function(error) {
    this.setState({ error: error });
  },
  getValue: function() {
    return $(this.refs.input.getDOMNode()).text();
  },
  reset: function() {
    $(this.refs.input.getDOMNode()).text(this.props.defaultValue ? this.props.defaultValue : '');
    this.setState({ error: null });
  },
  render: function() {
    return (
      <div className="form-row">
        { this.props.label ? <label ref="label">{ this.props.label }</label> : null }
        <div className="form-btw" dangerouslySetInnerHTML={{ __html: this.props.btw }} />
        <div className={ 'composer' + (this.state.disabled ? ' disabled' : '') } contentEditable={ !this.state.disabled } id={ this.state.id } ref="input" data-placeholder={ this.props.placeholder || '' } />
        { this.state.error ? <div className="form-error" dangerouslySetInnerHTML={{ __html: this.state.error }} /> : null }
      </div>
    );
  }
});

$(function() {
  $('body').on('focus', '[contenteditable]', function() {
    var $this = $(this);
    $this.data('before', $this.html());
    return true;
  }).on('blur keydown keyup paste input', '[contenteditable]', function() {
    var $this = $(this);
    if ($this.data('before') !== $this.html()) {
      $this.data('before', $this.html());
      $this.trigger('change');
    }
    return true;
  });
});
