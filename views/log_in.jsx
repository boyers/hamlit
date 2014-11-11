var LogIn = React.createClass({
  componentDidMount: function() {
    $(this.refs.email.getDOMNode()).focus();
  },
  render: function() {
    return (
      <div className="log-in clearfix">
        <div className="container vertical-margin">
          <div className="row">
            <div className="span4 offset4">
              <Form title="Welcome back!" submitText="Log in">
                <div className="form-row">
                  <label htmlFor="email">Email</label>
                  <input id="email" ref="email" type="text" placeholder="hello@example.com" />
                </div>
                <div className="form-row">
                  <label htmlFor="password">Password</label>
                  <input id="password" type="password" placeholder="eigenpassword" />
                  <div className="form-btw"><a href="/">Forgot password?</a></div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
