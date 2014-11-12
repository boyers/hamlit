var LogIn = React.createClass({
  componentDidMount: function() {
    this.refs.form.focus();
  },
  render: function() {
    return (
      <div className="log-in clearfix">
        <div className="container vertical-margin">
          <div className="row">
            <div className="span4 offset4">
              <Form ref="form" title="Welcome back!" submitText="Log in" url="/api/log_in" fields={[
                <Input id="email" label="Email" placeholder="hello@example.com" />,
                <Input id="password" label="Password" placeholder="eigenpassword" btw="Click &lt;a href=&quot;/&quot;>here&lt;/a&gt; if you forgot it." />
              ]} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
