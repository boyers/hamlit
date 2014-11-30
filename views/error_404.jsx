var Error404 = React.createClass({
  render: function() {
    return (
      <div className="container clearfix">
        <div className="row">
          <div className="span8 offset2">
            <div className="vertical-margin">
              Oops, that page does not exist. Try the <a href="/">home page</a>?
            </div>
          </div>
        </div>
      </div>
    );
  }
});
