var Settings = React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },
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
        component.refs.username_form.reset();
        component.refs.password_form.reset();
        if (callback) {
          callback();
        }
      });
    } else {
      $(component.getDOMNode()).stop().slideDown(300, function() {
        component.refs.username_form.focus();
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
      component.refs.username_form.reset();
      component.refs.password_form.reset();
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
    this.refs.username_form.reset();
    this.refs.password_form.reset();
    $(this.getDOMNode()).stop().css('display', 'none');
    this.setState({ isOpen: false });
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

    return (
      <div className="settings clearfix">
        <div className="container vertical-margin">
          <div className="row">
            <div className="span4 offset4">
              <h2>{ username }</h2>
              <hr />
              <Form ref="username_form" submitText="Save username" endpoint="/api/update_username" onSuccess={ onComplete } fields={[
                <Input id="username" label="Username" placeholder={ username } defaultValue={ username } />
              ]} />
              <Form ref="password_form" submitText="Save password" endpoint="/api/update_password" onSuccess={ onComplete } fields={[
                <Input id="old_password" label="Old password" type="password" placeholder="l0rd 0f th3 fl13s" btw="So we know it&rsquo;s really you." />,
                <Input id="new_password" label="New password" type="password" placeholder="l0rd 0f th3 r1ngs" btw="Please pick a good one." />,
                <Input id="verifyPassword" label="Verify password" type="password" placeholder="l0rd 0f th3 r1ngs" btw="Just to make sure you got it right." />
              ]} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
