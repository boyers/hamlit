var Feed = React.createClass({
  propTypes: {
    loggedInUser: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      loading: true,
      broken: false
    };
  },
  componentDidMount: function() {
    var component = this;
    window.api('/api/home', component, { }, function(data) {
      component.setState({ loading: false, broken: false });
    }, function() {
      component.setState({ loading: false, broken: true });
    });
  },
  componentWillUnmount: function() {
    window.stopAsyncTasks(this);
  },
  componentDidUpdate: function(prevProps, prevState) {
    var component = this;
    if (!_.isEqual(prevProps, component.props)) {
      window.api('/api/home', component, { }, function(data) {
        component.setState({ loading: false, broken: false });
      }, function() {
        component.setState({ loading: false, broken: true });
      });
    }
  },
  render: function() {
    if (this.state.broken) {
      return <Error500 />;
    }

    if (this.state.loading) {
      return <div className="big-spinner-container"><Spinner /></div>;
    }

    return (
      <div className="container clearfix">
        <div className="row">
          <div className="span8 offset2">
            <div className="vertical-margin">
              Feed
            </div>
          </div>
        </div>
      </div>
    );
  }
});
