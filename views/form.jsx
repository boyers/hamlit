var Form = React.createClass({
  render: function() {
    return (
      <form>
        <h2>{ this.props.title }</h2>
        <hr />
        { this.props.children }
      </form>
    );
  }
});
