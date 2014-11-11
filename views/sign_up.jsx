var SignUp = React.createClass({
  componentDidMount: function() {
    $(this.refs.email.getDOMNode()).focus();
  },
  render: function() {
    return (
      <div className="sign-up clearfix">
        <div className="container vertical-margin">
          <div className="row">
            <div className="span4 offset4">
              <Form title="Welcome to Eigenfeed!" submitText="Sign up">
                <div className="form-row">
                  <label htmlFor="email">Email</label>
                  <input id="email" ref="email" type="text" placeholder="hello@example.com" />
                  <div className="form-btw">Don&rsquo;t worry&mdash;it won&rsquo;t be public.</div>
                </div>
                <div className="form-row">
                  <label htmlFor="password">Password</label>
                  <input id="password" type="password" placeholder="eigenpassword" />
                  <div className="form-btw">We&rsquo;ll trust you to pick a good one.</div>
                </div>
                <div className="form-row">
                  <label htmlFor="password">Verify password</label>
                  <input id="password" type="password" placeholder="eigenpassword" />
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
