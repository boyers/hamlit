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
    this.setState({ loading: true });
    window.api('/api/home', this.getDOMNode(), { }, function(data) {
      component.setState({ loading: false, broken: false });
    }, function() {
      component.setState({ loading: false, broken: true });
    });
  },
  componentWillUnmount: function() {
    window.stopAsyncTasks(this.getDOMNode());
  },
  componentDidUpdate: function(prevProps, prevState) {
    var component = this;
    if (!_.isEqual(prevProps, this.props)) {
      this.setState({ loading: true });
      window.api('/api/home', this.getDOMNode(), { }, function(data) {
        component.setState({ loading: false, broken: false });
      }, function() {
        component.setState({ loading: false, broken: true });
      });
    }
  },
  render: function() {
    if (this.state.loading) {
      return <div className="big-spinner-container"><Spinner /></div>;
    }

    if (this.state.broken) {
      return <Error500 />;
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
