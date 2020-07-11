import React, { Component } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Pagination from './Pagination';
import Axios from 'axios'

function rand() {
    return Math.round(Math.random() * 20) - 10;
  }
  
  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

const styles = theme => ({
    paper: {
      position: 'absolute',
      width: theme.spacing.unit * 50,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing.unit * 4,
      outline: 'none',
    },
    teamNamebg:{
        backgroundColor:"#E1F5FE",
        opaciy:".9",
        borderRadius:".2rem",
        padding:"1px",
        marginRight:".9rem",
        marginLeft:".5rem",
    }
  });


export class footballApi extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading:true,
            Name:null,
            TeamName:null,
            all:[],
            purchasing: false,
            totalPlayed:null,
            totalWin:null,
            totalLoss:null,
            totalDraw:null,
            currentPage: 1,
            postsPerPage: 1,
            open: false,
        }
    }


    handleOpen = () => {
        this.setState({ open: true });
      };
    
    handleClose = () => {
        this.setState({ open: false });
    };

      
    componentDidMount = () =>{
        let _url = "https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json"
        Axios.get(_url)
        .then(result=>{
            this.setState({
                Name : result.data.name,
                all:result.data.rounds,
                loading:false,
            })
            console.log(this.state.all)
        }).catch(error=>{
            console.log(error)
        })
    }

    

    matchPlayed(Name){
        let count = 0
        let drawScoreCount =0
        let winScoreCount = 0 
        let lossScoreCount = 0
        
        this.state.all.map(r=>{
            return r.matches.map(re=>{
                if((re.team1.name === Name) ||(re.team2.name === Name)){
                    count++
                }

                if(re.score1===re.score2 && (re.team1.name === Name || re.team2.name === Name)){
                    drawScoreCount++
                }

                if((re.score1>re.score2 && re.team1.name === Name) || (re.score2>re.score1 && re.team2.name === Name)){
                    winScoreCount++
                }

                if((re.score1<re.score2 && re.team1.name === Name) || (re.score2<re.score1 && re.team2.name === Name)){
                    lossScoreCount++
                }
                
                return this.setState({
                    totalPlayed:count,
                    totalWin:winScoreCount,
                    totalLoss:lossScoreCount,
                    totalDraw:drawScoreCount,
                    TeamName:Name
                })
            })
        })
        console.log(Name , ":",count," ","Match Played")
        console.log(Name , ":",drawScoreCount," ","Match Draw")
        console.log(Name , ":",winScoreCount," ","Match Win")
        console.log(Name , ":",lossScoreCount," ","Match Loss")
    }


    leftNameClicked(LeftName){
       this.matchPlayed(LeftName)
       this.setState({ open: true })
    }
    rightNameClicked(RightName){
        this.matchPlayed(RightName)
        this.setState({ open: true })
    }

    paginate=(pageNumber)=>{
        this.setState({
            currentPage:pageNumber
        })
    }

    nextPage=()=>{
        this.setState({
            currentPage:(this.state.currentPage)+1
        })
        console.log(this.state.currentPage)
    }

    previousPage=()=>{
        this.setState({
            currentPage:(this.state.currentPage)-1
        })
         console.log(this.state.currentPage)
    }

    render() {
        const { classes } = this.props;
        const indexOfLastPost = (this.state.currentPage) * this.state.postsPerPage
        const indexOfFirstPost = indexOfLastPost - (this.state.postsPerPage)
        const currentPosts = this.state.all.slice(indexOfFirstPost,indexOfLastPost)
        return (
            <div className="container mt-5">
                {this.state.loading?<div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                </div>:<h4 className="text-center text-primary mb-5">{this.state.Name}</h4>}
                
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Date</b></TableCell>
                                <TableCell className="text-center"><b>Teams</b></TableCell>
                                <TableCell><b>Score</b></TableCell>
                            </TableRow>
                        </TableHead>

                        {this.state.loading?<div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        </div>:
                        <TableBody>
                       

                        {currentPosts.map(result => {
                            return result.matches.map((allData,i)=>{
                                return (
                                <TableRow key={i}>
                                        <TableCell component="th" scope="row">
                                        {allData.date}
                                        </TableCell> 
                                        
                                        <TableCell className="text-center"><a href="!#" onClick={()=>this.leftNameClicked(allData.team1.name)} className={classes.teamNamebg}>{allData.team1.name} </a> Vs <a href="!#" onClick={()=>this.rightNameClicked(allData.team2.name)} className={classes.teamNamebg}> {allData.team2.name}</a></TableCell>
                                        <TableCell className="text-danger"><b>{allData.score1}- {allData.score2}</b></TableCell>
                                    </TableRow>
                                )
                            })
                        })}
                    </TableBody>}
                
                    </Table>
                </TableContainer>

                <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
                >
                <div style={getModalStyle()} className={classes.paper}>
                    <h6 className="text-center text-light bg-primary p-2">{this.state.TeamName}</h6>
                <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell><b>Played</b></TableCell>
                        <TableCell align="right"><b>Win</b></TableCell>
                        <TableCell align="right"><b>Loss</b></TableCell>
                        <TableCell align="right"><b>Draw</b></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow >
                        <TableCell component="th" scope="row">
                            {this.state.totalPlayed}
                        </TableCell>
                        <TableCell align="right">{this.state.totalWin}</TableCell>
                        <TableCell align="right">{this.state.totalLoss}</TableCell>
                        <TableCell align="right">{this.state.totalDraw}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </TableContainer>
                </div>
                </Modal>


                <div className="d-flex justify-content-center mt-5">
                    <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.all.length} paginate={this.paginate} nextPage={this.nextPage} previousPage={this.previousPage}/>
                </div>   

                </div>
        )
    }
}

footballApi.propTypes = {
    classes: PropTypes.object.isRequired,
};

const SimpleModalWrapped = withStyles(styles)(footballApi);

export default SimpleModalWrapped
