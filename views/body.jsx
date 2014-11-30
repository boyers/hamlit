var Body = React.createClass({
  getInitialState: function() {
    return {
      relativeURL: null,
      loggedInUser: null,
      waitingForAuthData: true
    };
  },
  loadRelativeURL: function(URL) {
    this.setState({
      relativeURL: window.makeRelativeURL(URL)
    });
    this.refs.signUp.closeImmediately();
    this.refs.logIn.closeImmediately();
    this.refs.settings.closeImmediately();
  },
  componentDidMount: function() {
    var component = this;
    if (/sessionId/.test(document.cookie)) {
      window.api('/api/get_user_data', { }, function(data) {
        component.setState({
          loggedInUser: data.user,
          waitingForAuthData: false
        });
      }, function() {
        component.setState({
          loggedInUser: null,
          waitingForAuthData: false
        });
      });
    } else {
      component.setState({
        loggedInUser: null,
        waitingForAuthData: false
      });
    }
  },
  componentDidUpdate: function(prevProps, prevState) {
    // After logging in or out, do a virtual page reload.
    if ((this.state.loggedInUser === null) !== (prevState.loggedInUser === null) || prevState.waitingForAuthData) {
      this.loadRelativeURL(makeRelativeURL(window.location.href));
    }
  },
  render: function() {
    var component = this;

    var view = <Spinner />;
    if (this.state.relativeURL !== null) {
      if (this.state.relativeURL === '/') {
        view = React.createElement(Feed, {
          loggedInUser: this.state.loggedInUser
        });
      } else {
        view = React.createElement(User, {
          loggedInUser: this.state.loggedInUser,
          normalizedUsername: decodeURIComponent(this.state.relativeURL.slice(1))
        });
      }
    }

    return (
      <div>
        <div className="header-spacer" />
        <div className="fixed-top">
          <Header
            clickLogIn={ function() { component.refs.signUp.close(function() { component.refs.logIn.toggle(); }); } }
            clickSignUp={ function() { component.refs.logIn.close(function() { component.refs.signUp.toggle(); }); } }
            clickSettings={ function() { component.refs.settings.toggle(); } }
            loggedInUser={ component.state.loggedInUser }
            waitingForAuthData={ component.state.waitingForAuthData }
          />
          <LogIn ref="logIn" />
          <SignUp ref="signUp" />
          <Settings ref="settings" loggedInUser={ component.state.loggedInUser } />
        </div>
        <div className="container clearfix">
          <div className="row">
            <div className="span8 offset2">
              <div className="vertical-margin">
                { view }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
