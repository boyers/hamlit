var SignUp = React.createClass({
  componentDidMount: function() {
    this.refs.form.focus();
  },
  render: function() {
    return (
      <div className="sign-up clearfix">
        <div className="container vertical-margin">
          <div className="row">
            <div className="span4 offset4">
              <Form ref="form" title="Welcome to Hamlit!" submitText="Sign up" endpoint="/api/sign_up" fields={[
                <Input id="email" label="Email" placeholder="piggy@example.com" btw="Don&rsquo;t worry&mdash;it won&rsquo;t be public." />,
                <Input id="password" label="Password" type="password" placeholder="l0rd 0f th3 fl13s" btw="Please pick a good one." />,
                <Input id="verify_password" label="Verify password" type="password" placeholder="l0rd 0f th3 fl13s" btw="Just to make sure you got it right." />
              ]} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
