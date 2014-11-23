var Header = React.createClass({
  propTypes: {
    clickLogIn: React.PropTypes.func.isRequired,
    clickSignUp: React.PropTypes.func.isRequired,
    clickSettings: React.PropTypes.func.isRequired,
    user: React.PropTypes.object,
    waitingForInitialData: React.PropTypes.bool.isRequired
  },
  getInitialState: function() {
    return {
      loggingOut: false
    };
  },
  render: function() {
    var component = this;

    var clickLogOut = function() {
      if (component.state.loggingOut === false) {
        component.setState({
          loggingOut: true
        });
        $.ajax({
          type: 'POST',
          url: '/api/log_out',
          data: { }
        }).always(function() {
          component.setState({
            loggingOut: false
          });
        }).done(function(data) {
          if (data.error === null) {
            window.bodyComponent.setUserData(null);
          }
        });
      }
    };

    var nav = <span className="nav-spinner"><Spinner /></span>;
    if (window.hasOwnProperty('bodyComponent') && !this.props.waitingForInitialData) {
      if (component.props.user) {
        nav = (
          <span>
            <a href={ '/' + component.props.user.normalizedUsername }>{ component.props.user.username }</a>
            <TextButton onSubmit={ component.props.clickSettings }>Settings</TextButton>
            <TextButton className={ component.state.loggingOut ? 'disabled' : '' } onSubmit={ clickLogOut }>Log out</TextButton>
          </span>
        );
      } else {
        nav = (
          <span>
            <a href="/about">About</a>
            <TextButton onSubmit={ component.props.clickLogIn }>Log in</TextButton>
            <TextButton onSubmit={ component.props.clickSignUp }>Sign up</TextButton>
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
