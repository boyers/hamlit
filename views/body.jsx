var Body = React.createClass({
  getInitialState: function() {
    return {
      relativeURL: null,
      loggedInUser: null,
      waitingForAuthData: true,
      waitingForPageData: true
    };
  },
  loadRelativeURL: function(URL) {
    var component = this;

    component.setState({
      relativeURL: window.makeRelativeURL(URL),
      waitingForPageData: true
    });
    component.refs.signUp.closeImmediately();
    component.refs.logIn.closeImmediately();
    component.refs.settings.closeImmediately();

    if (URL === '/') {
      $.ajax({
        type: 'POST',
        url: '/api/home',
        data: { }
      }).done(function(data) {
        if (!data.error) {
          component.setState({
            waitingForPageData: false
          });
        }
      });
    } else {
      $.ajax({
        type: 'POST',
        url: '/api/user',
        data: { username: URL.slice(1) }
      }).done(function(data) {
        if (!data.error) {
          component.setState({
            waitingForPageData: false
          });
        }
      });
    }
  },
  // Note: This is only so application.js can log the user in on initial page load.
  // Just use window.bodyComponent.setState(...) otherwise.
  setUserData: function(user) {
    this.setState({
      loggedInUser: user,
      waitingForAuthData: false
    });
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (!this.state.loggedInUser) {
      this.refs.settings.closeImmediately();
    }
  },
  render: function() {
    var component = this;

    var view = <Spinner />;
    if (!this.state.waitingForPageData && this.state.relativeURL !== null) {
      if (this.state.relativeURL === '/') {
        view = React.createElement(ViewIndex, { });
      } else {
        view = React.createElement(User, { username: this.state.relativeURL.slice(1) });
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
          <div className="vertical-margin">
            { view }
          </div>
        </div>
      </div>
    );
  }
});
