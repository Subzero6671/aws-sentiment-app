import React, { Component } from 'react';
import ApprovalPieGraph from './ApprovalPieGraph';
import axios from 'axios';
import { Route, useNavigate, useLocation, Link } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL;

class SearchCard extends Component{
    constructor(props){
        super(props);

        this.handlePinSearch = this.handlePinSearch.bind(this);
        this.handleNavigateToDashboard = this.handleNavigateToDashboard.bind(this);
    }

    async handlePinSearch(){
        console.log(this.props.search.keyword);
        console.log(this.props.search.subreddit);
        try {
          // errors out for now
          let response = await axios.post(BASE_URL + "/pinned", {}, {params: {keyword:this.props.search.keyword, subreddit:this.props.search.subreddit}}); //TODO subreddit param misspelled in IAC
          console.log(JSON.stringify(response));
          //debugger;
          this.props.addPinnedSearchCallback(this.props.search);
        }
        catch (err) {
          console.log(err);
        }
      }

    handleNavigateToDashboard(){
        debugger;
        this.props.navigate("/searchDashboard", 
        {state: {
            search: this.props.search}});
    }
    
    render(){
        return(
            <div className='card justify-content-lg-center text-center'>
                <div className='row'>
                <div className='col text-end pt-2 me-2'>
                { this.props.addPinnedSearchCallback ? 
                <button type="button" className="btn btn-primary btn-sm" onClick={() => {this.handlePinSearch(this.props.search)}}><i class="bi bi-pin-angle-fill pe-1"></i>Pin</button>
                : <div/>}
                </div>
                </div>
                <div className='row'>
                <div className='co pt-2'>
                    <div>{"\"" + this.props.search.keyword + "\""}</div>
                </div>
               
                </div>
                
                
                <div>{"r/" + this.props.search.subreddit}</div>
                <div>
                    <ApprovalPieGraph approval_rating={this.props.search.approval_rating}/>
                </div>
                <div className='mt-2'>{"Approval Rating: " + this.props.search.approval_rating.toFixed(2)}%</div>
                {this.props.hideShowMore ? <div></div> : <button type="button" className="btn btn-dark m-2" onClick={this.handleNavigateToDashboard}>Show More</button>}
                
                
            </div>
        )
    }
}


function SearchCardWithNavigation(props) {
    let navigate = useNavigate();
    let location = useLocation();
    return <SearchCard {...props} navigate={navigate} location={location}/>
}

export default SearchCardWithNavigation;
