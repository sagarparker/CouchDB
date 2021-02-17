import './App.css';
import React from 'react'
import axios from 'axios';
import Swal from 'sweetalert2'
import {useForm} from 'react-hook-form';

export default function UpdateForm(props) {
    const {register,handleSubmit} = useForm();

    function getUserDataFromDatabase(){
        axios.get('http://localhost:8080/api/getAllUsersDetails',{ validateStatus: false })
        .then(response =>  {
          props.onChange(response.data.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    const updateUser = (data) =>{
        //Removing empty from fields
        for(let key in data){
          if(data[key]===""){
            delete data[key];
          }
        }
        axios.post('http://localhost:8080/api/updateUserDetails',data,{ validateStatus: false })
        .then(response =>  {
          if(response.data.result){
            console.log("User updated")
            getUserDataFromDatabase();
            Swal.fire(
                'Updated!',
                'User data is updated in the database',
                'success'
              )
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    return (
        <div>
            <form onSubmit={handleSubmit(updateUser)} className="mt-1">
            <input type="text" name="id" required className="inputBox" placeholder="Enter user id" ref={register}/>
            <input type="text" name="name" className="inputBox" placeholder="Enter your name" ref={register}/>
            <input type="text" name="age"  className="inputBox" placeholder="Enter your age" ref={register}/>
            <input type="number" name="phone"  className="inputBox" placeholder="Enter your phone no" ref={register}/>
            <input type="text" name="fav_sitcom"  className="inputBox" placeholder="Enter your favourite sitcom" ref={register}/>
            
            <button type="submit" className="insertBtn">Update user data</button>
          </form>
        </div>
    )
}
