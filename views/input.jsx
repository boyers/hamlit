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
      id: 'input-' + window.createGUID(),
      disabled: false
    };
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
    };

    return (
      <div className="form-row">
        { this.props.label ? <label htmlFor={ this.state.id }>{ this.props.label }</label> : null }
        <div className="form-btw" dangerouslySetInnerHTML={{ __html: this.props.btw }} />
        <input id={ this.state.id } ref="input" type={ this.props.type || 'text' } defaultValue={ this.props.defaultValue } onChange={ onChange } placeholder={ this.props.placeholder || '' } disabled={ this.state.disabled } />
        { this.state.error ? <div className="form-error" dangerouslySetInnerHTML={{ __html: this.state.error }} /> : null }
      </div>
    );
  }
});
