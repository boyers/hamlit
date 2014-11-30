var Spinner = React.createClass({
  componentDidMount: function() {
    $(this.getDOMNode()).hide().fadeIn(500);
  },
  render: function() {
    return (
      <i className="fa fa-circle-o-notch fa-spin" />
    );
  }
});
