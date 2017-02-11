import React, {Component} from 'react';
import Subheader from 'material-ui/Subheader';
import {browserHistory} from 'react-router';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AutoComplete from 'material-ui/AutoComplete';
import {List} from 'material-ui/List';
import {Card, CardActions, CardHeader, CardTitle} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import {get} from '../services/Requests';
import {modelURL} from '../services/urlFactory';
/**
* Representing the logic of presenting existing blogs
*/
class BlogsHomePage extends Component {

/**
* Navigates to the relevent blog page
* @param  {Integer} blogId Id of the selected blog
*/
  static onBlogClick(blogId) {
    browserHistory.push(`/blogs/${blogId}`);
  }

/**
* Class constructor
* @param {Object} props User define component
*/
  constructor(props) {
    super(props);

    this.state = {
      blogsData: [],
      open: false,
      message: '',
    },

    this.addNewBlog = this.addNewBlog.bind(this);
  }

  /**
   * Called after the component is mounted
   */
  componentDidMount() {
    this.requestData();
  }

/**
 * Request all data from the API
 */
  requestData() {
    const url = modelURL('blog');

    this.fetchData(url, 'blogs', true);
  }
/**
* Abstract function to fetch data from the API
* @param  {String} url           The URL to GET from
* @param  {String} stateVariable The name of the variable (inside state object) to store the data in
* @param  {String} isCollection  Indicates whether the returning data set is a collection
* @param  {Object} params        The params to be passed with the request
* @return {Promise}              The request promise object
*/
  fetchData(url, stateVariable, isCollection, params) {
    this.setState({
      [`${stateVariable}DataLoading`]: true,
    });

    return get(url, params)
      .then((response) => {
        this.setState({
          [`${stateVariable}DataLoading`]: false,
          [`${stateVariable}Data`]: isCollection ? response.data.results : response.data,
        });

        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
/**
* Navigates to the Add blogs page
*/
  addNewBlog() {
    browserHistory.push('blogs/new');
  }
/**
 * Hides the snack bar
 */
  handleRequestClose() {
    this.setState({
      open: false,
      message: '',
    });
  }
/**
* Render all blogs and autoComplete field
* @return {String} Blog list
*/
  render() {
    const handleRequestClose = this.handleRequestClose.bind(this);
    const blogName = [];
    this.state.blogsData.map((blog) =>
      blogName.push(blog.name)
    );
    const blogs = this.state.blogsData.map((blog) => {
      const onBlogClick = BlogsHomePage.onBlogClick.bind(this, blog.id);
      const noOfPosts = blog.Posts.length;
      // const blogsCount = blog.BlogCounts;
      // const blogCount = blogsCount.map((count) => {
      //   if(loggedUser === count.UserId) {
      //       console.log('found');
      //   }
      // });
      // console.log(blog.BlogCounts);

      return (
        <div key={blog.id}>
          <Card>
            <CardHeader
              title="No of posts"
              subtitle={noOfPosts}
            />
            <CardTitle title={blog.name} subtitle={blog.author} />
            <CardActions>
              <RaisedButton label="Click here for posts" onClick={onBlogClick} />
            </CardActions>
          </Card>
        </div>
      );
    });

    const buttonStyle = {
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      marginBottom: '10px',
      zIndex: 99999,
    };

    return (
      <div className =".app.blogList">
        <Snackbar
         open={this.state.open}
         message={this.state.message}
         autoHideDuration={4000}
         onRequestClose={handleRequestClose}
       />
        <div>
          <AutoComplete
            floatingLabelText="Search Blogs"
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={blogName}
            onNewRequest={this.addNewBlog}
            fullWidth
          />
        </div>
        <List>
          <Subheader>Blogs</Subheader>
          {blogs}
        </List>
        <FloatingActionButton onClick={this.addNewBlog} style={buttonStyle}>
          <ContentAdd />
        </FloatingActionButton>
    </div>
    );
  }
}

export default BlogsHomePage;