var Settings = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      isOpen: false,
      usernameAvailable: null,
      confirmAccountDeletionOpen: false
    };
  },
  componentDidMount: function() {
    $(this.getDOMNode()).hide();
    $(this.refs.deleteAccountForm.getDOMNode()).hide();
  },
  reset: function() {
    this.refs.usernameForm.reset();
    this.refs.passwordForm.reset();
    $(this.refs.deleteAccountForm.getDOMNode()).hide();
    this.setState({ confirmAccountDeletionOpen: false });
  },
  toggle: function(callback) {
    var component = this;
    if (component.state.isOpen) {
      $(component.getDOMNode()).stop().slideUp(300, function() {
        component.reset();
        if (callback) {
          callback();
        }
      });
    } else {
      $(component.getDOMNode()).stop().slideDown(300, function() {
        component.refs.usernameForm.focus();
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
      component.reset();
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
    this.reset();
    $(this.getDOMNode()).stop().hide();
    this.setState({ isOpen: false });
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (!_.isEqual(this.props.user, prevProps.user)) {
      this.reset();
    }
  },
  render: function() {
    var component = this;

    var onComplete = function(data) {
      component.close();
      window.bodyComponent.setUserData(data.user);
    };

    var username = null;
    if (component.props.user) {
      username = component.props.user.username;
    }

    var onChangeUsername = debounce(function(event) {
      var newUsername = component.refs.usernameForm.refs.username.getValue().replace(/^\s+|\s+$/g, '');

      if (newUsername === '' || newUsername.toLowerCase() === username.toLowerCase()) {
        component.setState({ usernameAvailable: null });
      } else {
        $.ajax({
          type: 'POST',
          url: '/api/check_username',
          data: {
            username: newUsername
          }
        }).done(function(data) {
          component.setState({ usernameAvailable: data.result });
        });
      }
    });

    var onDeleteAccount = function(data) {
      window.bodyComponent.setUserData(null);
    };

    var usernameBtw = 'You can always change it later.';
    if (component.state.usernameAvailable !== null) {
      if (component.state.usernameAvailable) {
        usernameBtw = 'Looks good!';
      } else {
        usernameBtw = 'That username is taken.';
      }
    }

    return (
      <div className="settings clearfix">
        <div className="container vertical-margin">
          <div className="row">
            <div className="span8 offset2">
              <h2>Settings</h2>
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="span4 offset2">
              <Form ref="usernameForm" submitText="Save username" endpoint="/api/update_username" onSuccess={ onComplete } fields={[
                <Input id="username" label="Username" onChange={ onChangeUsername } placeholder={ username } defaultValue={ username } btw={ usernameBtw } />
              ]} />
              <hr />
              <p>
                To delete your account, click <TextButton onSubmit={ function() {
                  if (component.state.confirmAccountDeletionOpen) {
                    $(component.refs.deleteAccountForm.getDOMNode()).slideUp();
                  } else {
                    $(component.refs.deleteAccountForm.getDOMNode()).slideDown();
                  }
                  component.setState({ confirmAccountDeletionOpen: !component.state.confirmAccountDeletionOpen });
                } }>here</TextButton>.
              </p>
              <Form ref="deleteAccountForm" submitText="Confirm account deletion" endpoint="/api/delete_account" onSuccess={ onDeleteAccount } fields={ [] } />
            </div>
            <div className="span4">
              <Form ref="passwordForm" submitText="Save password" endpoint="/api/update_password" onSuccess={ onComplete } fields={[
                <Input id="newPassword" label="New password" type="password" placeholder="l0rd 0f th3 r1ngs" btw="Please pick a good one." />,
                <Input id="verifyPassword" label="Verify password" type="password" placeholder="l0rd 0f th3 r1ngs" btw="Just to make sure you got it right." />,
                <Input id="oldPassword" label="Old password" type="password" placeholder="l0rd 0f th3 fl13s" btw="So we know it&rsquo;s really you." />
              ]} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
