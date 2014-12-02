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
    window.api('/api/user', this.getDOMNode(), {
      username: this.props.normalizedUsername
    }, function(data) {
      component.setState({ loading: false, user: data.user });
      component.refs.form.focus();
    }, function() {
      component.setState({ loading: false, user: null });
    });
  },
  componentWillUnmount: function() {
    window.stopAsyncTasks(this.getDOMNode());
  },
  componentDidUpdate: function(prevProps, prevState) {
    var component = this;
    if (!_.isEqual(prevProps, this.props)) {
      window.api('/api/user', this.getDOMNode(), {
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
    if (this.state.loading) {
      return <div className="big-spinner-container"><Spinner /></div>;
    }

    if (!this.state.user) {
      return <Error404 />;
    }

    var userToUser = null;
    if (this.props.loggedInUser && this.state.user) {
      userToUser = (
        <div className="blue">
          <div className="container clearfix">
            <div className="row">
              <div className="span8 offset2">
                <div className="vertical-margin">
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
                    <Composer id="content" placeholder="Got something to share?" />
                  ]} />
                </div>
              </div>
            </div>
          </div>
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
