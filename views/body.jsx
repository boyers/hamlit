var Body = React.createClass({
  getInitialState: function() {
    return {
      relativeURL: null,
      logInVisible: false,
      signUpVisible: false
    };
  },
  loadRelativeURL: function(URL) {
    this.setState({
      relativeURL: window.makeRelativeURL(URL),
      logInVisible: false,
      signUpVisible: false
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
        { this.state.logInVisible ? <LogIn /> : null }
        { this.state.signUpVisible ? <SignUp /> : null }
        <div className="container clearfix">
          <div className="vertical-margin">
            { view }
          </div>
        </div>
      </div>
    );
  }
});
