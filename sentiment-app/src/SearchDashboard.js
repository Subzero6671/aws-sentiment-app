import React, { Component } from "react";
import SearchCard from "./SearchCard";
import axios from "axios";
import ApprovalPieGraph from "./ApprovalPieGraph";
import { Route, useNavigate, useLocation, Link } from "react-router-dom";
import LineGraph from "./LineGraph";
import { parse, format } from "date-fns";

const BASE_URL = process.env.REACT_APP_API_URL;

const formatDate = (dateString) => {
    let parsed = parse(dateString, "yyyyMMdd", new Date())
    return format(parsed, "EEEE, LLL do, yyyy")
}

const formatDateForGraph = (dateString) =>{
    let parsed = parse(dateString, "yyyyMMdd", new Date())
    return format(parsed, "LLL dd")
}

class SearchDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: props.location.state?.search.keyword,
      subreddit: props.location.state?.search.subreddit,
      results: [],
    };
  }

  async componentDidMount() {
    // GET results from the endpoint
    try {
      let response = await axios.get(BASE_URL + "/results", {
        params: {
          keyword: this.state.keyword,
          subreddit: this.state.subreddit,
        },
      });
      let results = JSON.parse(response.data.body);
      let sorted_results = results.sort(function (a, b) {
        return a["date"].localeCompare(b["date"]);
      });
      let formatted_results = sorted_results.map((result)=>{
        result["formatted_date"] = formatDateForGraph(result.date);
        result["approval_rating"] = result.approval_rating.toFixed(2);
        return result;
      })
      this.setState({ results: formatted_results });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div className="m-3 mx-4 mt-4 px-5 py-4">
        <div className="row">
          <div className="col-lg-3">
            <h4 className="text-center">Approval Rating Today</h4>
            <SearchCard search={this.props.location.state?.search} hideShowMore={true}/>
          </div>
          <div className="col">
            <h4 className="text-center">Sentiment over last week</h4>
            <LineGraph data={this.state.results} />
          </div>
        </div>
        <div className="row mt-4 g-5 text-center">
          <h2>Comment Samples</h2>
        </div>
        <hr></hr>
        <div className="row mt-1 g-5">
          <div className="col">
            <h5>Positive Comments: </h5>
            <ul class="timeline">
              {this.state.results.map((data) => (
                <li class="timeline-item">
                  <h6 className="text-reddit mb-0">{formatDate(data.date)}</h6>
                  <p className="comment-example-text">"{data.comments.positive}"</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="col">
            <h5>Negative Comments: </h5>
            <ul class="timeline">
              {this.state.results.map((data) => (
                <li class="timeline-item">
                  <h6 className="text-reddit mb-0">{formatDate(data.date)}</h6>
                  <p className="comment-example-text">"{data.comments.negative}"</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="col">
            <h5>Mixed Comments: </h5>
            <ul class="timeline">
              {this.state.results.map((data) => (
                <li class="timeline-item">
                  <h6 className="text-reddit mb-0">{formatDate(data.date)}</h6>
                  <p className="comment-example-text">"{data.comments.mixed}"</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

function SearchDashboardWithNavigation(props) {
  let navigate = useNavigate();
  let location = useLocation();
  return <SearchDashboard {...props} navigate={navigate} location={location} />;
}

export default SearchDashboardWithNavigation;
