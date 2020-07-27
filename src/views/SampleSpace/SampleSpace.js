import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    paddingTop: 150,
    textAlign: 'center'
  },
}));

const SampleSpace = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
        spacing={4}
      >
        <Grid
          item
          lg={6}
          xs={12}
        >

      <NameForm />

        </Grid>
      </Grid>
    </div>
  );
};


class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '' ,  status: 'None'};
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit = (event) => {
    alert('A form was submitted: ' + JSON.stringify(this.state));

    fetch('http://localhost:5000/parse_dict', {
        method: 'POST',
        // We convert the React state to JSON and send it as the POST body
        body: JSON.stringify(this.state)
      })
      .then(response => { return response.json();})
    .then(responseData => {return responseData;})
    .then(data => {
      console.log(data);
      this.setState({"status" : data.message });
    })

    .catch(err => {
        console.log("fetch error" + err);
    });

    event.preventDefault();
}

  render() {
    return (
    <div>
      <form onSubmit={this.handleSubmit}>
        <label>
          Account Name:
          <input type="text" value={this.state.value} name="name" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div>
        <h6>Status:</h6>
        <ul>
          {this.state.status}
        </ul>
      </div>
    </div>
    );
  }
}

export default SampleSpace;
