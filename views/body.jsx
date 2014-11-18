var Body = React.createClass({
  getInitialState: function() {
    return {
      relativeURL: null,
      logInVisible: false,
      signUpVisible: false,
      user: null,
      waitingForUserData: true
    };
  },
  loadRelativeURL: function(URL) {
    this.setState({
      relativeURL: window.makeRelativeURL(URL),
      logInVisible: false,
      signUpVisible: false
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
          clickLogIn={ function() { component.setState({ logInVisible: !component.state.logInVisible, signUpVisible: false }); } }
          clickSignUp={ function() { component.setState({ signUpVisible: !component.state.signUpVisible, logInVisible: false }); } }
        />
        { this.state.logInVisible ? <LogIn onComplete={ function(data) { component.setState({ logInVisible: false, user: data }); } } /> : null }
        { this.state.signUpVisible ? <SignUp onComplete={ function(data) { component.setState({ signUpVisible: false, user: data }); } } /> : null }
        <div className="container clearfix">
          <div className="vertical-margin">
            { view }
          </div>
        </div>
      </div>
    );
  }
});
