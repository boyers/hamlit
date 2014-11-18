var Input = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    btw: React.PropTypes.string,
    name: React.PropTypes.string,
    type: React.PropTypes.string,
    placeholder: React.PropTypes.string
  },
  getInitialState: function() {
    return { error: null };
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
    $(this.refs.input.getDOMNode()).val('');
    this.setState({ error: null });
  },
  render: function() {
    return (
      <div className="form-row">
        <label htmlFor={ 'input-' + this.props.id }>{ this.props.label }</label>
        <div className="form-btw" dangerouslySetInnerHTML={{__html: this.props.btw}} />
        <input id={ 'input-' + this.props.id } name={ this.props.name || this.props.id } ref="input" type={ this.props.type || 'text' } placeholder={ this.props.placeholder || '' } />
        { (this.state.error === null) ? null : <div className="form-error">{ this.state.error }</div> }
      </div>
    );
  }
});
