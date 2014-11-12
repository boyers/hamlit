var Form = React.createClass({
  getInitialState: function() {
    return { submitted: false, error: null };
  },
  focus: function() {
    var firstFieldRef = this.props.fields[0].props.id;
    $(this.refs[firstFieldRef].getInput().getDOMNode()).focus();
  },
  submit: function(event) {
    var component = this;
    event.preventDefault();
    event.stopPropagation();

    if (!component.state.submitted) {
      $(component.getDOMNode()).find('textarea, input').prop('disabled', true);
      component.setState({ submitted: true, error: null });

      var data = {};
      $(component.getDOMNode()).find('textarea:not([type="submit"]), input:not([type="submit"])').each(function(index, element) {
        data[$(element).prop('name')] = $(element).val();
      });

      $.ajax({
        type: 'POST',
        url: component.props.url,
        data: data
      }).always(function() {
        $(component.refs.submit.getDOMNode()).blur();
        $(component.getDOMNode()).find('textarea, input').prop('disabled', false);
        component.setState({ submitted: false });
      }).done(function(data) {
        var i, field;
        if (data.error === null && data.validationErrors === null) {
          $(component.getDOMNode()).find('textarea:not([type="submit"]), input:not([type="submit"])').val('');
          for (i = 0; i < component.props.fields.length; i++) {
            field = component.props.fields[i];
            component.refs[field.props.id].setError(null);
          }
          if (component.props.hasOwnProperty('onSuccess')) {
            component.props.onSuccess(data);
          }
        } else {
          if (data.validationErrors !== null) {
            for (var ref in data.validationErrors) {
              component.refs[ref].setError(data.validationErrors[ref]);
            }
            for (i = 0; i < component.props.fields.length; i++) {
              field = component.props.fields[i];
              if (data.validationErrors.hasOwnProperty(field.props.id)) {
                $(component.refs[field.props.id].getInput().getDOMNode()).focus();
                break;
              }
            }
          }
          component.setState({ error: data.error });
        }
      }).fail(function() {
        component.setState({ error: 'Uh oh, there was a network error.' });
      });
    }
  },
  render: function() {
    var fields = _.map(this.props.fields, function(field) {
      return React.addons.cloneWithProps(field, {
        key: field.props.id,
        ref: field.props.id
      });
    });

    return (
      <form onSubmit={ this.submit }>
        <h2>{ this.props.title }</h2>
        <hr />
        { fields }
        <div className="form-row align-right">
          { this.state.submitted ? <Spinner /> : null }
          <input type="submit" ref="submit" value={ this.props.submitText } />
          { (this.state.error === null) ? null : <div className="form-error">{ this.state.error }</div> }
        </div>
      </form>
    );
  }
});
