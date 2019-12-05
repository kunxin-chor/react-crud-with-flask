import React, { Component } from 'react'
import axios from 'axios'
import { throwStatement } from '@babel/types';

let url = 'http://localhost:8081';

export default class App extends Component {

  state = {
    animals:[],
    newAnimal:{
      name:"",
      breed:"",
      microship:""
    },
    processing:false,
    editing:false,
    animalBeingEdited: {
      _id: {
        $oid:''
      },
      name:'',
      breed:'',
      microship:''
    }
  }

  componentDidMount() {
    axios.get(url).then( (response)=>{
      this.setState({
        animals: response.data
      })
    })
  }

  handleChange = (event) => {
    this.setState({
      newAnimal: {
        ...this.state.newAnimal,
        [event.target.name] : event.target.value
      }
    })
  }

  handleEditChange = (event) => {
    this.setState({
      animalBeingEdited: {
        ...this.state.animalBeingEdited,
        [event.target.name] : event.target.value
      }
    })
  }

  add = () =>
  {
     this.setState({
       processing:true,
       newAnimal:{
         name:"",
         microship:"",
         breed:""
       }
     })

     axios.post(url+'/newAnimal', {
       'animal-name': this.state.newAnimal.name,
       'breed': this.state.newAnimal.breed,
       'microchip': this.state.newAnimal.microship
     }).then( (r) => {
       this.setState({
         animals: [
           ...this.state.animals,
           r.data
         ],
         processing:false
       })
     })
  }

  showEdit = (animal) => {
    this.setState({
      editing: true,
      animalBeingEdited: {
        ...animal
      }
    })
  }

  update = (animal) => {
    
    axios.put(url + '/updateAnimal/' + animal._id.$oid,{
      'animal-name': this.state.animalBeingEdited.name,
      'breed': this.state.animalBeingEdited.breed,
      'microchip': this.state.animalBeingEdited.microchip
    }).then(r=>{

      let index = this.state.animals.findIndex( (a) =>{ 
          return a._id.$oid === animal._id.$oid
        }
      );
      
      this.setState({
        animals: [
          ...this.state.animals.slice(0, index),
          r.data,
          ...this.state.animals.slice(index+1)
        ],
        editing:false
      })

    })
  }

  delete(animal) {
    axios.delete(url + "/deleteAnimal/" + animal._id.$oid)
      .then( r => {

        let index = this.state.animals.findIndex( a => a._id.$oid===animal._id.$oid);

        this.setState({
          animals: [
            ...this.state.animals.slice(0, index),
            ...this.state.animals.slice(index+1)
          ]
        })

      })
  }

  render() {
    return (
      <div>
        <h1>Animals</h1>

        { this.state.animals.length == 0 ? "Loading..." : null}

        <ul>
          { this.state.animals.map ( a=> {
            return (<li>
              <div>
                {a.name} - <button onClick={() => this.showEdit(a)}>Edit</button>
                <button onClick={ () => this.delete(a)}>Delete</button>
              </div>

              { this.state.editing && this.state.animalBeingEdited._id.$oid == a._id.$oid ? 
            
                 (<div>
                    <input type='text' name='name' placeholder="Animal's name"  value={this.state.animalBeingEdited.name} onChange={this.handleEditChange}/><br/>
                    <input type='text' name='breed' placeholder='Breed' value={this.state.animalBeingEdited.breed} onChange={this.handleEditChange}/><br/>
                    <input type='text' name='microship' placeholder='Microship' value={this.state.animalBeingEdited.microchip} onChange={this.handleEditChange}/><br/>
                    <button onClick={ () => this.update(a)} disabled={this.state.processing}>Update</button>
                  </div>
                 )
            : null}
              </li>)
          })}
        </ul>

        <div>
          <input type='text' name='name' placeholder="Animal's name"  value={this.state.newAnimal.name} onChange={this.handleChange}/><br/>
          <input type='text' name='breed' placeholder='Breed' value={this.state.newAnimal.breed} onChange={this.handleChange}/><br/>
          <input type='text' name='microship' placeholder='Microship' value={this.state.newAnimal.microship} onChange={this.handleChange}/><br/>
          <button onClick={this.add} disabled={this.state.processing}>Add</button>  

          { this.state.processing ? "Processing..." : null}

        </div>

      </div>
    )
  }
}
