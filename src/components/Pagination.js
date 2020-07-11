import React from 'react'

 const Pagination =(props) =>{
    const pageNumber = [];
    for(let i = 1; i<=Math.ceil(props.totalPosts/props.postsPerPage);i++){
        pageNumber.push(i);
    }
    return (
        <nav>
            <ul className="pagination">
                <li className="page-item">
                    <a className="page-link" onClick={()=>props.previousPage()} href="!#">Previous</a>
                </li>
                {pageNumber.map(number=>{
                   return(<li key={number} className="page-item">
                        <a onClick={()=>props.paginate(number)} href="!#" className="page-link">
                            {number}
                        </a>
                    </li>)
                })}
                 <li className="page-item">
                    <a className="page-link" onClick={()=>props.nextPage()} href="!#">Next</a>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination
