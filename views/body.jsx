var Body = React.createClass({
  getInitialState: function() {
    return {
      relativeURL: null,
      user: null,
      waitingForUserData: true
    };
  },
  loadRelativeURL: function(URL) {
    this.setState({
      relativeURL: window.makeRelativeURL(URL)
    });
  },
  isWaitingForUserData: function() {
    return this.state.waitingForUserData;
  },
  getUserData: function() {
    return this.state.user;
  },
  setUserData: function(data) {
    this.setState({
      user: data,
      waitingForUserData: false
    });
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
        />
        <LogIn ref="logIn" onComplete={ function(data) { component.setState({ user: data }); } } />
        <SignUp ref="signUp" onComplete={ function(data) { component.setState({ user: data }); } } />
        <div className="container clearfix">
          <div className="vertical-margin">
            { view }
          </div>
        </div>
      </div>
    );
  }
});
