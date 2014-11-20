var Body = React.createClass({
  getInitialState: function() {
    return {
      relativeURL: null,
      user: null,
      waitingForInitialData: true
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
  // Note: This is only so application.js can log the user in on initial page load.
  // Just use window.bodyComponent.setState(...) otherwise.
  setUserData: function(user) {
    this.setState({
      user: user,
      waitingForInitialData: false
    });
  },
  componentDidUpdate: function(prevProps, prevState) {
    if (!this.state.user) {
      this.refs.settings.closeImmediately();
    }
  },
  render: function() {
    var component = this;

    var view = null;
    if (this.state.relativeURL !== null) {
      if (/^\/$/.test(this.state.relativeURL)) {
        view = React.createElement(ViewIndex, { });
      } else if (/^\/about$/.test(this.state.relativeURL)) {
        view = React.createElement(ViewAbout, { });
      } else {
        view = React.createElement(View404, { });
      }
    }

    return (
      <div>
        <Header
          clickLogIn={ function() { component.refs.signUp.close(function() { component.refs.logIn.toggle(); }); } }
          clickSignUp={ function() { component.refs.logIn.close(function() { component.refs.signUp.toggle(); }); } }
          clickSettings={ function() { component.refs.settings.toggle(); } }
          user={ this.state.user }
          waitingForInitialData={ component.state.waitingForInitialData }
        />
        <LogIn ref="logIn" />
        <SignUp ref="signUp" />
        <Settings ref="settings" user={ this.state.user } />
        <div className="container clearfix">
          <div className="vertical-margin">
            { view }
          </div>
        </div>
      </div>
    );
  }
});
