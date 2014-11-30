var User = React.createClass({
  propTypes: {
    loggedInUser: React.PropTypes.object,
    normalizedUsername: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {
      loading: true,
      user: null
    };
  },
  componentDidMount: function() {
    var component = this;
    window.api('/api/user', {
      username: this.props.normalizedUsername
    }, function(data) {
      component.setState({ loading: false, user: data.user });
      component.refs.form.focus();
    }, function() {
      component.setState({ loading: false, user: null });
    });
  },
  componentDidUpdate: function(prevProps, prevState) {
    var component = this;
    if (!_.isEqual(prevProps, component.props)) {
      window.api('/api/user', {
        username: this.props.normalizedUsername
      }, function(data) {
        component.setState({ loading: false, user: data.user });
        component.refs.form.focus();
      }, function() {
        component.setState({ loading: false, user: null });
      });
    }
  },
  render: function() {
    if (this.state.nonexistent) {
      return <Error404 />;
    }

    if (this.state.loading) {
      return <Spinner />;
    }

    var userToUser = null;
    if (this.props.loggedInUser && this.state.user) {
      userToUser = (
        <div>
          <div>
            <Username
              username={ this.props.loggedInUser.username }
              normalizedUsername={ this.props.loggedInUser.normalizedUsername }
            />
            <i className="fa fa-caret-right user-to-user" />
            <Username
              username={ this.state.user.username }
              normalizedUsername={ this.state.user.normalizedUsername }
            />
          </div>
          <Form ref="form" submitText="Post" endpoint="/api/submit" onSuccess={ function() { } } fields={[
            <Composer id="content" placeholder="Hello, world!" />
          ]} />
        </div>
      );
    }

    return (
      <div>
        { userToUser }
      </div>
    );
  }
});
