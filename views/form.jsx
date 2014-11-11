var Form = React.createClass({
  getInitialState: function() {
    return { submitted: false };
  },
  submit: function(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.state.submitted) {
      $(this.getDOMNode()).find('textarea, input').prop('disabled', true);
      this.setState({ submitted: true });
    }
  },
  render: function() {
    return (
      <form onSubmit={ this.submit }>
        <h2>{ this.props.title }</h2>
        <hr />
        { this.props.children }
        <div className="form-row align-right">
          { this.state.submitted ? <Spinner /> : null }
          <input type="submit" ref="submit" value={ this.props.submitText } />
        </div>
      </form>
    );
  }
});
