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
                <Input id="email" label="Email" placeholder="hello@example.com" btw="Don&rsquo;t worry&mdash;it won&rsquo;t be public." />,
                <Input id="password" label="Password" type="password" placeholder="lordoftheflies1954" btw="We&rsquo;ll trust you to pick a good one." />,
                <Input id="verify_password" label="Verify password" type="password" placeholder="lordoftheflies1954" />
              ]} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
