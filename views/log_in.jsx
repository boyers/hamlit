var LogIn = React.createClass({
  propTypes: {
    onComplete: React.PropTypes.func.isRequired
  },
  componentDidMount: function() {
    this.refs.form.focus();
  },
  render: function() {
    return (
      <div className="log-in clearfix">
        <div className="container vertical-margin">
          <div className="row">
            <div className="span4 offset4">
              <Form ref="form" title="Welcome back!" submitText="Log in" endpoint="/api/log_in" onSuccess={ this.props.onComplete } fields={[
                <Input id="email" label="Email" placeholder="piggy@example.com" />,
                <Input id="password" label="Password" type="password" placeholder="l0rd 0f th3 fl13s" btw="Click &lt;a href=&quot;/&quot;>here&lt;/a&gt; if you forgot it." />
              ]} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
