var Spinner = React.createClass({
  componentDidMount: function() {
    var component = this;
    $(this.getDOMNode()).hide().fadeIn(500);
    window.registerAsyncTask(500, this.getDOMNode(), function() {
      $(component.getDOMNode()).stop();
    });
  },
  componentWillUnmount: function() {
    window.stopAsyncTasks(this.getDOMNode());
  },
  render: function() {
    return (
      <i className="fa fa-circle-o-notch fa-spin" />
    );
  }
});
