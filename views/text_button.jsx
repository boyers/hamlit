var TextButton = React.createClass({
  propTypes: {
    onSubmit: React.PropTypes.func.isRequired
  },
  render: function() {
    var component = this;
    var className = this.props.className || '';
    var other = _.omit(this.props, 'className', 'tabIndex', 'onSubmit', 'onClick', 'onKeyDown');
    var onClick = function(e) {
      component.props.onSubmit();
      e.preventDefault();
      e.stopPropagation();
    };
    var onKeyDown = function(e) {
      if (e.which === 13) {
        component.props.onSubmit();
        e.preventDefault();
        e.stopPropagation();
      }
    };
    return (
      <span {...other} tabIndex="0" className={ 'text-button ' + className } onClick={onClick} onKeyDown={onKeyDown}>{ this.props.children }</span>
    );
  }
});
