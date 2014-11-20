var Input = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    btw: React.PropTypes.string,
    name: React.PropTypes.string,
    type: React.PropTypes.string,
    defaultValue: React.PropTypes.string,
    placeholder: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      error: null,
      id: 'input-' + Math.random().toString(36).slice(2)
    };
  },
  focus: function() {
    return $(this.refs.input.getDOMNode()).focus();
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
    return (
      <div className="form-row">
        <label htmlFor={ this.state.id }>{ this.props.label }</label>
        <div className="form-btw" dangerouslySetInnerHTML={{ __html: this.props.btw }} />
        <input id={ this.state.id } name={ this.props.name || this.props.id } ref="input" type={ this.props.type || 'text' } defaultValue={ this.props.defaultValue } placeholder={ this.props.placeholder || '' } />
        { (this.state.error === null) ? null : <div className="form-error" dangerouslySetInnerHTML={{ __html: this.state.error }} /> }
      </div>
    );
  }
});
