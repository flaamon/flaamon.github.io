import BootstrapTable from 'react-bootstrap-table-next'
import {useEffect,useState,createContext} from 'react'
import {Button,Modal} from 'react-bootstrap'
import paginationFactory from 'react-bootstrap-table2-paginator'
import ToolkitProvider,{Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit'
import "bootstrap/dist/css/bootstrap.min.css"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import Fuse from 'fuse.js'
import axios from 'axios'
import objectProp from 'object-path'
import './App.css';

function App() {
  
  const { SearchBar } = Search;
  const ModalContext = createContext();
  const [countries, setCountries]= useState([]);
  const [show, setShow] =useState(false);
	const [search,setSearch]= useState([]);
  const [filteredCountries,setFilteredCountries]= useState([]);
  const [showModal, setShowModal] =useState(false);
 const [modalInfo, setModalInfo]=useState([]);
 const handleClose=()=>setShow(false);                      const handleShow=()=> setShow(true);

  const toggleTrueFalse=()=>{                                     setShowModal(handleShow);
  }
   const ModalContent =({show,modalInfo})=>{

  return(
  <Modal show={showModal} onHide={handleClose}>                      <Modal.Header closeButton>                                    <Modal.Tittle>Country Stats</Modal.Tittle>              </Modal.Header>                                            <Modal.Body>                                                 <h1> Country Stats:</h1>                                   <p>Subregion:{modalInfo.subregion}</p>                      <p>Status:{modalInfo.status}</p>
       <p>Independence:{modalInfo.independence}</p>
       <p>Region:{modalInfo.region}</p>
      </Modal.Body>                                              <Modal.Footer>                                               <Button variant="warning" onClick={handleClose}>               Close                                                  </Button>
      </Modal.Footer>                                          </Modal>);
     };

  useEffect(()=>{

    getData();
  },[]);
  useEffect(()=>{
     
	  const fuse =new Fuse(countries);
	  const results= fuse.search(search)
          .map((result)=> result.name.common.toLowerCase());
	  console.log(results);
	  setFilteredCountries(results);
  },[search]);

  const getData= async()=>{
   
	  const results = await axios.get("https://restcountries.com/v3.1/all");
	  console.log(results.data);
	  setCountries(results.data);
	  setFilteredCountries(results.data);
	  console.log(countries);
  }
  const rowEvent ={
	     
	       onClick:(e,row,rowIndex)=>{
        
                  setModalInfo(row);
		   
		toggleTrueFalse(); },

 };
  const concatFormatter=(idd)=>{
         const codes =idd.suffixes.map((suffix)=>{
             return idd.root + suffix;
	 });
	  return codes;
  }
  const imageFormatter=(cell,row)=>(<img style={{ maxWidth: "100%" }} src={cell} />);
  const columns =[{                                            dataField:"flags.png",                                        text:"Flags",                                              formatter:imageFormatter,                                  },{                                                          dataField:"name.official",                                text:"Country Name",                                       sort: true,                                               },                                                         {                                                           dataField:"cca2",                                         text:"Country Code [2]",                                  },{                                                          dataField:"cca3",                                         text:"Country Code [3]",                                  },{                                                           dataField:"name.nativeName.zho.official",                text:"Native Country Name",                               },{                                                          dataField:"altSpellings",                                 text:"Alternative Country Name",                          },{                                                          dataField:"idd",                                          text:"Country Calling Codes",                              formatter:concatFormatter,                                }];

 
  return (
    <div className="App">
     <ToolkitProvider
          keyField="id"
          data={ countries}
          columns={ columns }
          search
         >
     {
	props=>(
	<div>
	 <SearchBar {...props.searchProps}
		onChange={(e)=>setSearch(e.target.value)}/>
         <BootstrapTable 
		{...props.baseProps}
	          pagination = {paginationFactory({
			  sizePerPage:25})}
	         rowEvents={rowEvent}
	         striped
		 hover
		 condensed
             />
	</div>)
      } 
     </ToolkitProvider>
    { show?
	  <ModalContent show={showModal} modalInfo={modalInfo}/>
	: <p> theres nothing to show</p>
    }
    </div>
  );
}

export default App;
