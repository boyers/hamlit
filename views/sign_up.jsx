var SignUp = React.createClass({
  getInitialState: function() {
    return {
      isOpen: false,
      usernameAvailable: null
    };
  },
  componentDidMount: function() {
    $(this.getDOMNode()).hide();
  },
  toggle: function(callback) {
    var component = this;
    if (component.state.isOpen) {
      $(component.getDOMNode()).stop().slideUp(window.constants.animationDuration, function() {
        component.refs.form.reset();
        if (callback) {
          callback();
        }
      });
    } else {
      $(component.getDOMNode()).stop().slideDown(window.constants.animationDuration, function() {
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
      $(component.getDOMNode()).stop().slideUp(window.constants.animationDuration, done);
    }
    component.setState({ isOpen: false });
  },
  closeImmediately: function() {
    this.refs.form.reset();
    $(this.getDOMNode()).stop().hide();
    this.setState({ isOpen: false });
  },
  render: function() {
    var component = this;

    var onComplete = function(data) {
      component.close();
      window.bodyComponent.setUserData(data.user);
    };

    var onChangeUsername = debounce(function(event) {
      var username = component.refs.form.refs.username.getValue().replace(/^\s+|\s+$/g, '');

      if (username === '') {
        component.setState({ usernameAvailable: null });
      } else {
        $.ajax({
          type: 'POST',
          url: '/api/check_username',
          data: {
            username: username
          }
        }).done(function(data) {
          component.setState({ usernameAvailable: data.result });
        });
      }
    });

    var usernameBtw = 'You can always change it later.';
    if (component.state.usernameAvailable !== null) {
      if (component.state.usernameAvailable) {
        usernameBtw = 'Looks good!';
      } else {
        usernameBtw = 'That username is taken.';
      }
    }

    return (
      <div className="blue clearfix">
        <div className="container vertical-margin">
          <div className="row">
            <div className="span4 offset4">
              <Form ref="form" title="Welcome to Hamlit!" submitText="Sign up" endpoint="/api/sign_up" onSuccess={ onComplete } fields={[
                <Input id="username" label="Username" onChange={ onChangeUsername } placeholder="piggy" btw={ usernameBtw } />,
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
