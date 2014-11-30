var Input = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    label: React.PropTypes.string,
    btw: React.PropTypes.string,
    type: React.PropTypes.string,
    defaultValue: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onChange: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      error: null,
      id: 'input-' + Math.random().toString(36).slice(2),
      form: null,
      disabled: false
    };
  },
  setForm: function(form) {
    this.setState({ form: form });
  },
  focus: function() {
    return $(this.refs.input.getDOMNode()).focus();
  },
  setDisabled: function(disabled) {
    this.setState({ disabled: disabled });
  },
  setError: function(error) {
    this.setState({ error: error });
  },
  getValue: function() {
    return $(this.refs.input.getDOMNode()).val();
  },
  reset: function() {
    $(this.refs.input.getDOMNode()).val(this.props.defaultValue ? this.props.defaultValue : '');
    this.setState({ error: null });
  },
  render: function() {
    var component = this;

    var onChange = function(event) {
      component.setState({ error: null });

      if (component.props.onChange) {
        component.props.onChange(event);
      }

      if (component.state.form) {
        component.state.form.clearFormError();
      }
    };

    return (
      <div className="form-row">
        { component.props.label ? <label htmlFor={ component.state.id }>{ component.props.label }</label> : null }
        <div className="form-btw" dangerouslySetInnerHTML={{ __html: component.props.btw }} />
        <input id={ component.state.id } ref="input" type={ component.props.type || 'text' } defaultValue={ component.props.defaultValue } onChange={ onChange } placeholder={ component.props.placeholder || '' } disabled={ component.state.disabled } />
        { component.state.error ? <div className="form-error" dangerouslySetInnerHTML={{ __html: component.state.error }} /> : null }
      </div>
    );
  }
});
