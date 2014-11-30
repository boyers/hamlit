var Spinner = React.createClass({
  componentDidMount: function() {
    $(this.getDOMNode()).hide().fadeIn(window.constants.animationDuration);
  },
  render: function() {
    return (
      <i className="fa fa-circle-o-notch fa-spin" />
    );
  }
});
