import React, { Component } from 'react';
import SearchCard from './SearchCard';
import './App.css'
import axios from 'axios';
import ApprovalPieGraph from './ApprovalPieGraph';

const BASE_URL = process.env.REACT_APP_API_URL;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pinnedSearches: [],
      keyword: '',
      subreddit: 'all',
      pinSearch: false,
      subdredditSearch: false,
      currentSearch: undefined,
      loading: false
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchTypeSelect = this.handleSearchTypeSelect.bind(this);
    this.handleKeywordInput = this.handleKeywordInput.bind(this);
    this.handleSubredditInput = this.handleSubredditInput.bind(this);
    this.addPinnedSearchCallback = this.addPinnedSearchCallback.bind(this);
  }

  async componentDidMount() {
    // GET pinned searches from database and set state
    try{
      let response = await axios.get(BASE_URL + "/pinned");
      console.log(response);
      let pins = JSON.parse(response.data.body);
      this.setState({pinnedSearches: pins});
    }
    catch(err){
      console.log(err);
    }
  }

  async handleSearch() {
    console.log(this.state.keyword);
    console.log(this.state.subreddit);
    try {
      this.setState({ loading: true });
      let response = await axios.get(BASE_URL + "/search", { params: { keyword: this.state.keyword, subreddit: this.state.subreddit } }); //TODO change v1 to base URL instead of only get search
      //debugger;
      let search = JSON.parse(response.data.body);
      this.setState({ currentSearch: search, loading: false });
      console.log(JSON.stringify(search));
    }
    catch (err) {
      console.log(err);
    }
  }

  async getPinnedSearches() {

  }

  handleKeywordInput(event) {
    this.setState({ keyword: event.target.value });
  }

  handleSubredditInput(event) {
    this.setState({ subreddit: event.target.value });
  }

  handleSearchTypeSelect(event) {
    if (event.target.value === 'subreddit') {
      this.setState({ subdredditSearch: true });
    }
    else {
      this.setState({ subdredditSearch: false, subreddit: 'all' });
    }
  }

  addPinnedSearchCallback(search) {
    let updatedPins = this.state.pinnedSearches;
    updatedPins.push(search);
    this.setState({ pinnedSearches: updatedPins });
    debugger;
  }

  render() {
    return (
      <div className='AppContainer'>
        <div className="px-4 py-5 mt-5 mb-2 text-center">
    <img className="d-block mx-auto mb-4" src="https://logodownload.org/wp-content/uploads/2018/02/reddit-logo-16.png" alt="" width="72"  />
    <h1 className="display-5 fw-bold text-body-emphasis">Sentiment Analysis</h1>
    <div className="col-lg-6 mx-auto">
      <p className="lead mb-4">Search a topic below to see what everyone thinks!</p>
      <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
      <div className='InputContainer'>
          <div style={{ display: 'inline-block' }}>
          <div className="row g-1">
          <div className="col-lg-4">
            
            <select onChange={this.handleSearchTypeSelect} className="form-select">
              <option value='top'>Top Posts</option>
              <option value='subreddit'>By Subreddit</option>
            </select>
            </div>
            <div className="col-lg-6">
            <input type='text' value={this.state.searchText} onChange={this.handleKeywordInput} className="form-control" placeholder='Enter search term'/>
            </div>
            <div className="col-lg-2">
            <button onClick={this.handleSearch} type="button" className="btn btn-primary">Search</button>
            </div>
          </div>
          <div className='row mt-2'>
            <div className='col-lg-6 offset-lg-4'>
            {this.state.subdredditSearch ?
              <input type='text' value={this.state.subreddit} onChange={this.handleSubredditInput} className="form-control" placeholder='Enter subreddit name'/>
              : <div></div>}
              </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
        <div className='SearchDisplayContainer'>
        {this.state.loading ?
            <div className='row my-3 text-center'>
              <div className='col'>
              Loading...
              </div>
              
              
              </div>
              : <div></div>}
          {this.state.currentSearch ?
            <div className='row justify-content-sm-center mx-5 px-5'>
              <div className='col-lg-3 '>
              <SearchCard search={this.state.currentSearch} addPinnedSearchCallback={this.addPinnedSearchCallback} />
              </div>
              </div>
            : <div></div>}
        </div>
        <div className='PinnedSearchHeaderContainer text-center'>
          <h3 className='PinnedSearchHeader mt-3'>Pinned Searches</h3>
        </div>
        <div className='SearchCardContainer'>
          <div className='row px-5 mx-5 py-3 g-5'>
          
          {this.state.pinnedSearches.map((search, index) => (
            <div className='col-lg-3'>
            <SearchCard key={index} search={search} />
            </div>
          ))}
          
          </div>
        </div>
      </div>


    )
  }
}

export default App;

const searchDisplayContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center'
}
