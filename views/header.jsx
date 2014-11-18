var Header = React.createClass({
  propTypes: {
    clickLogIn: React.PropTypes.func.isRequired,
    clickSignUp: React.PropTypes.func.isRequired
  },
  render: function() {
    var component = this;

    var clickLogOut = function() {
      console.log('log out');
    };

    var nav = null;
    if (window.hasOwnProperty('bodyComponent') && !window.bodyComponent.isWaitingForUserData()) {
      if (window.bodyComponent.getUserData() === null) {
        nav = (
          <span>
            <a href="/about">About</a>
            <TextButton onSubmit={ component.props.clickLogIn }>Log in</TextButton>
            <TextButton onSubmit={ component.props.clickSignUp }>Sign up</TextButton>
          </span>
        );
      } else {
        nav = (
          <span>
            <a href="/about">About</a>
            <TextButton onSubmit={ clickLogOut }>Log out</TextButton>
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
                <a href="/"><Sprite name="icon" /> Hamlit</a>
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
