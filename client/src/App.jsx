import './App.css';
import React,{useEffect,useState} from 'react'
import axios from 'axios';
import {useForm} from 'react-hook-form';
import UpdateForm from './UpdateForm';
import Swal from 'sweetalert2'


function App() {
  const [userData,setUserData] = useState([]);
  const {register,handleSubmit} = useForm();

  function handleChange(newValue) {
    setUserData(newValue);
  }
  


  function getUserDataFromDatabase(){
    axios.get('http://localhost:8080/api/getAllUsersDetails',{ validateStatus: false })
    .then(response =>  {
      setUserData(response.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const insertUser = (data) =>{
    console.log(data);
    axios.post('http://localhost:8080/api/insertNewUser',data,{ validateStatus: false })
    .then(response =>  {
      if(response.data.result){
        console.log("User Inserted")
        getUserDataFromDatabase();
        Swal.fire(
          'Inserted!',
          'User added to the database',
          'success'
        )
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  function deleteUser(id,rev){
    axios.post('http://localhost:8080/api/deleteUser',{"id":id,"rev":rev},{ validateStatus: false })
    .then(response =>  {
      if(response.data.result){
        console.log("User deleted")
        getUserDataFromDatabase()
        Swal.fire(
          'Deleted!',
          'User deleted from the database',
          'error'
        )
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

 

  useEffect(()=>{
    getUserDataFromDatabase();
  },[]);



  
  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" style={{marginLeft:20}} href="/">CouchDB</a>
        </div>
      </nav>
    <div className="container-fluid">
      <div className="row">
      <div className="col-7 mainDiv">
          <h5 style={{marginLeft:20,marginTop:20}}>Insert new user</h5>
          <form onSubmit={handleSubmit(insertUser)} className="mt-1">
            <input type="text" name="name" required className="inputBox" placeholder="Enter your name." ref={register}/>
            <input type="number" name="age" required className="inputBox" placeholder="Enter your age" ref={register}/>
            <input type="number" name="phone" required className="inputBox" placeholder="Enter your phone no" ref={register}/>
            <input type="text" name="fav_sitcom" required className="inputBox" placeholder="Enter your favourite sitcom" ref={register}/>
            <button type="submit" className="insertBtn">Insert into database</button>
          </form>

          <h5 style={{marginLeft:20,marginTop:50}}>Update user</h5>

          <UpdateForm userData={userData} onChange={handleChange}/>
          
        </div>
        <div className="col-5 myInfoHolder">
              <div className="outPutHolder">
                  <h5>User data</h5>
                  {userData.map((data,index) =>{
                    return(
                      <div className="userDetailsDiv" key={index}>
                          <p><strong>Id   :</strong> {data._id}</p>
                          <p><strong>rev   :</strong> {data._rev}</p>
                          <p><strong>Name : </strong> {data.name}</p>
                          <p><strong>Age : </strong> {data.age}</p>
                          <p><strong>Phone no : </strong> {data.phone}</p>
                          <p><strong>Favourite sitcom : </strong> {data.fav_sitcom}</p>
                          <button type="submit" className="deleteBtn" onClick={()=> deleteUser(data._id,data._rev)}>Delete user</button>
                          
                      </div>
                    ) 
                  })}
              </div>
        </div>
      </div>
    </div>
     
    </div>
  );
}

export default App;
