import React from 'react';
import { Input, Button } from 'react-bootstrap';

//TODO: There should be request for catalog on load
var Catalog = React.createClass({

  handleKeyDown: function(ev) {
    if (ev.keyCode == 13) {
      this.props.fetch(ev.target.value)
    }
  },

  render: function() {
    const goButton = <Button>Go</Button>;
    return (
      <div>
        <Input type="text"
          defaultValue="http://localhost:8088/catalog"
          groupClassName="group-class"
          wrapperClassName="wrapper-class"
          labelClassName="label-class"
          buttonAfter={goButton}
          onKeyDown={this.handleKeyDown}/>
      </div>
    )
  }
});

module.exports = Catalog;