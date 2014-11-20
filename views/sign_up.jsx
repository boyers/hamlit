var SignUp = React.createClass({
  getInitialState: function() {
    return {
      isOpen: false
    };
  },
  componentDidMount: function() {
    $(this.getDOMNode()).css('display', 'none');
  },
  toggle: function(callback) {
    var component = this;
    if (component.state.isOpen) {
      $(component.getDOMNode()).stop().slideUp(300, function() {
        component.refs.form.reset();
        if (callback) {
          callback();
        }
      });
    } else {
      $(component.getDOMNode()).stop().slideDown(300, function() {
        component.refs.form.focus();
        if (callback) {
          callback();
        }
      });
    }
    component.setState({ isOpen: !component.state.isOpen });
  },
  close: function(callback) {
    var component = this;
    var done = function() {
      component.refs.form.reset();
      if (callback) {
        callback();
      }
    };
    if ($(component.getDOMNode()).css('display').toLowerCase() === 'none') {
      done();
    } else {
      $(component.getDOMNode()).stop().slideUp(300, done);
    }
    component.setState({ isOpen: false });
  },
  closeImmediately: function() {
    this.refs.form.reset();
    $(this.getDOMNode()).stop().css('display', 'none');
    this.setState({ isOpen: false });
  },
  render: function() {
    var component = this;

    var onComplete = function(data) {
      component.close();
      window.bodyComponent.setUserData(data.user);
    };

    return (
      <div className="sign-up clearfix">
        <div className="container vertical-margin">
          <div className="row">
            <div className="span4 offset4">
              <Form ref="form" title="Welcome to Hamlit!" submitText="Sign up" endpoint="/api/sign_up" onSuccess={ onComplete } fields={[
                <Input id="username" label="Username" placeholder="piggy" btw="You can always change it later." />,
                <Input id="password" label="Password" type="password" placeholder="l0rd 0f th3 fl13s" btw="Please pick a good one." />,
                <Input id="verifyPassword" label="Verify password" type="password" placeholder="l0rd 0f th3 fl13s" btw="Just to make sure you got it right." />
              ]} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
