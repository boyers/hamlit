var Settings = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      isOpen: false,
      usernameBtw: 'You can always change it later.',
      confirmingAccountDeletion: false
    };
  },
  componentDidMount: function() {
    $(this.getDOMNode()).hide();
  },
  reset: function() {
    this.refs.usernameForm.reset();
    this.refs.passwordForm.reset();
    this.setState({
      confirmingAccountDeletion: false,
      usernameBtw: 'You can always change it later.'
    });
  },
  toggle: function(callback) {
    var component = this;
    if (component.state.isOpen) {
      $(component.getDOMNode()).stop().slideUp(window.constants.animationDuration, function() {
        component.reset();
        if (callback) {
          callback();
        }
      });
    } else {
      $(component.getDOMNode()).stop().slideDown(window.constants.animationDuration, function() {
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
      $(component.getDOMNode()).stop().slideUp(window.constants.animationDuration, done);
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
      window.bodyComponent.setState({ user: data.user });
    };

    var oldUsername = null;
    if (component.props.user) {
      oldUsername = component.props.user.username;
    }

    var onChangeUsername = debounce(function(event) {
      var username = component.refs.usernameForm.refs.username.getValue();

      if (username === '') {
        component.setState({ usernameBtw: 'You can always change it later.' });
      } else {
        $.ajax({
          type: 'POST',
          url: '/api/check_username',
          data: {
            username: username,
            oldUsername: oldUsername
          }
        }).done(function(data) {
          if (data.error !== null) {
            component.setState({ usernameBtw: data.error });
          } else {
            if (data.result === true) {
              component.setState({ usernameBtw: 'Looks good!' });
            } else {
              component.setState({ usernameBtw: 'You can always change it later.' });
            }
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
      <div className="settings blue clearfix" onKeyDown={ onKeyDown }>
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
                <Input id="username" label="Username" onChange={ onChangeUsername } placeholder={ oldUsername } defaultValue={ oldUsername } btw={ component.state.usernameBtw } />
              ]} />
              <hr />
              <p>
                To delete your account, click <TextButton onSubmit={ function() {
                  component.setState({ confirmingAccountDeletion: !component.state.confirmingAccountDeletion });
                } }>here</TextButton>.
              </p>
              <Form ref="deleteAccountForm" submitText="Confirm account deletion" endpoint="/api/delete_account" disabled={ !component.state.confirmingAccountDeletion } onSuccess={ onComplete } fields={ [] } />
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
