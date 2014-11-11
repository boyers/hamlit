var LogIn = React.createClass({
  render: function() {
    return (
      <div className="log-in clearfix">
        <div className="container vertical-margin">
          <div className="row">
            <div className="span4 offset4">
              <Form title="Welcome back!">
                <div className="form-row">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="text" placeholder="hello@example.com" />
                </div>
                <div className="form-row">
                  <label htmlFor="password">Password</label>
                  <input id="password" type="password" placeholder="eigenpassword" />
                  <div className="form-btw"><a href="/">Forgot password?</a></div>
                </div>
                <div className="form-row align-right">
                  <input type="submit" value="Log in" />
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
