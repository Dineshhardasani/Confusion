import {baseUrl} from '../baseUrl.js';
import React,{Component} from 'react';
import {Card,CardImg,CardText,CardBody,CardTitle,Breadcrumb,BreadcrumbItem,Button,
        Modal,ModalHeader,ModalBody,Label,Row,Col} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Control,LocalForm,Errors} from 'react-redux-form';
import {Loading} from './LoadingComponent';
import {FadeTransform,Fade,Stagger} from 'react-animation-components';
const required=(val) => val && val.length;
const maxLength=(len) => (val) => !(val) || (val.length<=len);
const minLength=(len) => (val) => val && (val.length>=len);

class CommentForm extends Component{
  constructor(props){
    super(props);
    this.toggleModal=this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      isModalOpen: false
    };
  }
  toggleModal(){
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }
  handleSubmit(values){
    this.props.postComment(this.props.dishId,values.rating,values.author,values.comment);
    console.log('Current State is: ' + JSON.stringify(values));
     alert('Current State is: ' + JSON.stringify(values));

  }
  render(){
    return(
      <div>
      <Button outline onClick={this.toggleModal}>
        <span className="fa fa-pencil fa-lg"></span> Submit Comment
      </Button>
      <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>
              <LocalForm onSubmit={(values)=> this.handleSubmit(values)}>
                <Row className="form-group">
                  <Col>
                    <Label htmlFor="rating">Rating</Label>
                  </Col>
                  <Col md={12}>
                      <Control.select model=".rating" name="rating" type="number" className="form-control">
                        <option type="number" value="1">1</option>
                        <option type="number" value="2">2</option>
                        <option type="number" value="3">3</option>
                        <option type="number" value="4">4</option>
                        <option type="number" value="5">5</option>
                        <option type="number" value="6">6</option>
                      </Control.select>
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col>
                    <Label htmlFor="author">Your Name</Label>
                  </Col>
                  <Col md={12}>
                    <Control.text model=".author" id="name" name="name"
                       placeholder="Your Name"
                       className="form-control"
                       validators={{
                           required,minLength:minLength(3),maxLength:maxLength(15)
                       }}/>
                       <Errors
                             className="text-danger"
                             model=".author"
                             show="touched"
                             messages={{
                                 required: 'Required',
                                 minLength: 'Must be greater than 2 characters',
                                 maxLength: 'Must be 15 characters or less'
                             }}
                       />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col>
                    <Label htmlFor="comment">Comment</Label>
                  </Col>
                  <Col md={12}>
                    <Control.textarea model=".comment" id="comment" name="comment" rows="6" className="form-control"
                      validators={{  required }}/>
                      <Errors
                            className="text-danger"
                            model=".comment"
                            show="touched"
                            messages={{
                                required: 'Required'
                            }}
                      />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={12}>
                  <Button type="submit" color="primary">Submit</Button>
                  </Col>
                </Row>
              </LocalForm>
          </ModalBody>
      </Modal>
      </div>
    );
  }
}

function  RenderDish({dish}){
    return(
      <FadeTransform in transformProps={{exitTransform:'scale(0.5) translateY(-50%)'}}>
        <Card>
        <CardImg top src={baseUrl+dish.image} alt={dish.name} />
            <CardBody>
            <CardTitle>{dish.name}</CardTitle>
            <CardText>{dish.description} </CardText>
            </CardBody>
        </Card>
      </FadeTransform>
    );
}
function RenderComments({comments,postComment,dishId}){
  if(comments!=null)
    return(
      <div>
        <h4>Comments</h4>
        <ul className="list-unstyled">
          <Stagger in>
            {comments.map((comment)=>{
                return(
                    <Fade in>
                      <p>{comment.comment}<br></br>
                      {comment.author}</p>
                    </Fade>
                );
              })}
          </Stagger>
        </ul>
        <CommentForm dishId={dishId} postComment={postComment}/>
      </div>
    );
}

const DishDetail=(props)=>{
  if(props.isLoading){
    return(
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  }
  else if(props.errMess){
    return(
      <div className="container">
        <div className="row">
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  }
  else if(props.dish!=null){
      return(
              <div className="container">
              <div className="row">
                  <Breadcrumb>

                      <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                      <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                  </Breadcrumb>
                  <div className="col-12">
                      <h3>{props.dish.name}</h3>
                      <hr />
                  </div>
              </div>
              <div className="row">
                  <div className="col-12 col-md-5 m-1">
                      <RenderDish dish={props.dish} />
                  </div>
                  <div className="col-12 col-md-5 m-1">
                      <RenderComments comments={props.comments} postComment={props.postComment} dishId={props.dish.id} />
                  </div>
              </div>
              </div>
          );
      }
}
export default DishDetail;
