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
    this.state = { name: '' };
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit = (event) => {
    alert('A form was submitted: ' + this.state);

    fetch('http://localhost:5000/parse_dict', {
        method: 'POST',
        // We convert the React state to JSON and send it as the POST body
        body: JSON.stringify(this.state)
      }).then(async function(response) {
        const data = await response.json();
        console.log(data);
        return data;
      });

    event.preventDefault();
}

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Account Name:
          <input type="text" value={this.state.value} name="name" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default SampleSpace;
