var Header = React.createClass({
  propTypes: {
    clickLogIn: React.PropTypes.func.isRequired,
    clickSignUp: React.PropTypes.func.isRequired,
    clickSettings: React.PropTypes.func.isRequired,
    loggedInUser: React.PropTypes.object,
    waitingForAuthData: React.PropTypes.bool.isRequired
  },
  getInitialState: function() {
    return {
      loggingOut: false
    };
  },
  componentWillUnmount: function() {
    window.stopAsyncTasks(this.getDOMNode());
  },
  render: function() {
    var component = this;

    var clickLogOut = function() {
      if (component.state.loggingOut === false) {
        component.setState({
          loggingOut: true
        });
        window.api('/api/log_out', component.getDOMNode(), { }, function(data) {
          if (data.error === null) {
            window.bodyComponent.setState({ loggedInUser: null });
          }
          component.setState({
            loggingOut: false
          });
        }, function(data) {
          component.setState({
            loggingOut: false
          });
        });
      }
    };

    var nav = <span className="nav-spinner"><Spinner /></span>;
    if (!this.props.waitingForAuthData) {
      if (this.props.loggedInUser) {
        nav = (
          <span>
            <Username
              username={ this.props.loggedInUser.username }
              normalizedUsername={ this.props.loggedInUser.normalizedUsername }
            />
            <TextButton onSubmit={ this.props.clickSettings }>Settings</TextButton>
            <TextButton className={ this.state.loggingOut ? 'disabled' : '' } onSubmit={ clickLogOut }>Log out</TextButton>
          </span>
        );
      } else {
        nav = (
          <span>
            <TextButton onSubmit={ this.props.clickLogIn }>Log in</TextButton>
            <TextButton onSubmit={ this.props.clickSignUp }>Sign up</TextButton>
          </span>
        );
      }
    }

    return (
      <div className="header">
        <div className="container">
          <div className="row">
            <div className="span6">
              <h1 className="brand">
                <a href="/"><Sprite name="icon" /><span className="hidden">Hamlit</span></a>
              </h1>
            </div>
            <div className="span6 nav">
              { nav }
            </div>
          </div>
        </div>
      </div>
    );
  }
});
