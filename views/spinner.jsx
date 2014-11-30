var Spinner = React.createClass({
  componentDidMount: function() {
    var component = this;
    $(component.getDOMNode()).hide().fadeIn(500);
    window.registerAsyncTask(500, component, function() {
      $(component.getDOMNode()).stop();
    });
  },
  componentWillUnmount: function() {
    window.stopAsyncTasks(this);
  },
  render: function() {
    return (
      <i className="fa fa-circle-o-notch fa-spin" />
    );
  }
});
