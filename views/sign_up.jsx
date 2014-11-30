var SignUp = React.createClass({
  getInitialState: function() {
    return {
      isOpen: false,
      usernameBtw: 'You can always change it later.'
    };
  },
  componentDidMount: function() {
    $(this.getDOMNode()).hide();
  },
  componentWillUnmount: function() {
    window.stopAsyncTasks(this.getDOMNode());
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
      window.registerAsyncTask(window.constants.animationDuration, component.getDOMNode(), function() {
        $(component.getDOMNode()).stop();
      });
    } else {
      $(component.getDOMNode()).stop().slideDown(window.constants.animationDuration, function() {
        component.refs.form.focus();
        if (callback) {
          callback();
        }
      });
      window.registerAsyncTask(window.constants.animationDuration, component.getDOMNode(), function() {
        $(component.getDOMNode()).stop();
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
      window.registerAsyncTask(window.constants.animationDuration, component.getDOMNode(), function() {
        $(component.getDOMNode()).stop();
      });
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
      window.bodyComponent.setState({ loggedInUser: data.user });
    };

    var onChangeUsername = debounce(component.getDOMNode, function(event) {
      var username = component.refs.form.refs.username.getValue();

      if (/^\s*$/.test(username)) {
        component.setState({ usernameBtw: 'You can always change it later.' });
      } else {
        window.api('/api/check_username', component.getDOMNode(), {
          username: username
        }, function(data) {
          component.setState({ usernameBtw: 'Looks good!' });
        }, function(data) {
          if (data) {
            component.setState({ usernameBtw: data.error });
          }
        });
      }
    });

    var onKeyDown = function(event) {
      if (event.keyCode === 27) {
        component.close();
        event.stopPropagation();
      }
    };

    return (
      <div className="blue clearfix" onKeyDown={ onKeyDown }>
        <div className="container vertical-margin">
          <div className="row">
            <div className="span4 offset4">
              <Form ref="form" title="Welcome to Hamlit!" submitText="Sign up" endpoint="/api/sign_up" onSuccess={ onComplete } fields={[
                <Input id="username" label="Username" onChange={ onChangeUsername } placeholder="piggy" btw={ component.state.usernameBtw } />,
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
