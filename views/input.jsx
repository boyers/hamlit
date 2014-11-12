var Input = React.createClass({
  getInitialState: function() {
    return { error: null };
  },
  setError: function(error) {
    this.setState({ error: error });
  },
  getInput: function() {
    return this.refs.input;
  },
  render: function() {
    return (
      <div className="form-row">
        <label htmlFor={ 'input-' + this.props.id }>{ this.props.label }</label>
        <div className="form-btw" dangerouslySetInnerHTML={{__html: this.props.btw}} />
        <input id={ 'input-' + this.props.id } name={ this.props.name || this.props.id } ref="input" type={ this.props.type || 'text' } placeholder={ this.props.placeholder } />
        { (this.state.error === null) ? null : <div className="form-error">{ this.state.error }</div> }
      </div>
    );
  }
});
