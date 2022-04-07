import React from "react";
import { Container, Form, Button } from "react-bootstrap"

export default class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  getQuestions() {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    return fetch("http://127.0.0.1:3001/questions", requestOptions)
      .then(response => response.text())
  }
  onSubmit(event) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ responses: this.state.questions, startedAt: this.state.startedAt });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://127.0.0.1:3001/submit-quiz", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    event.preventDefault();
  }
  onChange({ target }) {
    const [qId, aId] = target.id.split("-");
    const data = [...this.state.questions];
    data[qId].response = aId;
    data[qId].attemptedAt = new Date();
    this.setState({ questions: data })
  }
  componentWillMount() {
    this.getQuestions()
      .then(data => {
        data = JSON.parse(data);
        this.setState({ questions: data.questions, startedAt: new Date() });
      })
      .catch(err => {
        console.log("Error in get questions:", err);
      })
  }
  render() {
    return (
      <Container style={{ textAlign: "left", marginTop: "2%" }}>
        <div style={{ textAlign: "right" }}>
          <Button variant="success" style={{}} onClick={() => window.open('http://localhost:3001/download', "_blank")}>
            Download Responses
          </Button>
        </div>
        {this.state.questions ?
          <Form onSubmit={e => this.onSubmit(e)} style={{ margin: "1%" }}>
            {this.state.questions.map((question, id) =>
              <Form.Group style={{ marginBottom: "2%" }} controlId={question.varname} key={question.varname}>
                <Form.Label style={{ fontWeight: "bold" }}>{id + 1}. {question.questiontext}</Form.Label>
                <div style={{ marginLeft: "5%" }}>
                  {question.options.map(option =>
                    <Form.Check
                      required={true}
                      onClick={e => this.onChange(e)}
                      key={option}
                      inline={"true"}
                      type={"radio"}
                      id={`${id}-${option}`}
                      label={option}
                      name={question.varname}
                    />
                  )}
                </div>
              </Form.Group>
            )}
            <Button variant="primary" type="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </Form>
          :
          <p>Loading questions</p>
        }
      </Container>
    );
  }
}