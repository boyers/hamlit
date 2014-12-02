var LogIn = React.createClass({
  getInitialState: function() {
    return {
      isOpen: false
    };
  },
  componentDidMount: function() {
    $(this.getDOMNode()).hide();
  },
  componentWillUnmount: function() {
    window.stopAsyncTasks(this.getDOMNode());
  },
  toggle: function(callback) {
    var component = this;
    if (this.state.isOpen) {
      $(this.getDOMNode()).stop().slideUp(window.constants.animationDuration, function() {
        component.refs.form.reset();
        if (callback) {
          callback();
        }
      });
      window.registerAsyncTask(window.constants.animationDuration, this.getDOMNode(), function() {
        $(component.getDOMNode()).stop();
      });
    } else {
      $(this.getDOMNode()).stop().slideDown(window.constants.animationDuration, function() {
        component.refs.form.focus();
        if (callback) {
          callback();
        }
      });
      window.registerAsyncTask(window.constants.animationDuration, this.getDOMNode(), function() {
        $(component.getDOMNode()).stop();
      });
    }
    this.setState({ isOpen: !this.state.isOpen });
  },
  close: function(callback) {
    var component = this;
    var done = function() {
      component.refs.form.reset();
      if (callback) {
        callback();
      }
    };
    if ($(this.getDOMNode()).css('display').toLowerCase() === 'none') {
      done();
    } else {
      $(this.getDOMNode()).stop().slideUp(window.constants.animationDuration, done);
      window.registerAsyncTask(window.constants.animationDuration, this.getDOMNode(), function() {
        $(component.getDOMNode()).stop();
      });
    }
    this.setState({ isOpen: false });
  },
  closeImmediately: function() {
    this.refs.form.reset();
    $(this.getDOMNode()).stop().hide();
    this.setState({ isOpen: false });
  },
  render: function() {
    var component = this;

    var onComplete = function(data) {
      window.bodyComponent.setState({ loggedInUser: data.user });
    };

    var onKeyDown = function(event) {
      if (event.keyCode === 27) {
        component.close();
        event.stopPropagation();
      }
    };

    return (
      <div className="blue clearfix" onKeyDown={ onKeyDown }>
        <div className="container vertical-margin">
          <div className="row">
            <div className="span4 offset4">
              <Form ref="form" title="Welcome back!" submitText="Log in" endpoint="/api/log_in" onSuccess={ onComplete } fields={[
                <Input id="username" label="Username" placeholder="piggy" />,
                <Input id="password" label="Password" type="password" placeholder="l0rd 0f th3 fl13s" />
              ]} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
