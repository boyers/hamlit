var LogIn = React.createClass({
  propTypes: {
    onComplete: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {
      isOpen: false
    };
  },
  componentDidMount: function() {
    $(this.getDOMNode()).css('display', 'none');
  },
  toggle: function(callback) {
    var component = this;
    if (component.state.isOpen) {
      $(component.getDOMNode()).stop().slideUp(300, function() {
        component.refs.form.focus();
        if (callback) {
          callback();
        }
      });
    } else {
      $(component.getDOMNode()).stop().slideDown(300, function() {
        component.refs.form.focus();
        if (callback) {
          callback();
        }
      });
    }
    component.setState({ isOpen: !component.state.isOpen });
  },
  close: function(callback) {
    $(this.getDOMNode()).stop().slideUp(300, callback);
    this.setState({ isOpen: false });
  },
  render: function() {
    var component = this;

    var onComplete = function() {
      component.close();
      component.props.onComplete();
    };

    return (
      <div className="log-in clearfix">
        <div className="container vertical-margin">
          <div className="row">
            <div className="span4 offset4">
              <Form ref="form" title="Welcome back!" submitText="Log in" endpoint="/api/log_in" onSuccess={ onComplete } fields={[
                <Input id="email" label="Email" placeholder="piggy@example.com" />,
                <Input id="password" label="Password" type="password" placeholder="l0rd 0f th3 fl13s" btw="Click &lt;a href=&quot;/&quot;>here&lt;/a&gt; if you forgot it." />
              ]} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
