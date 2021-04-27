<template>
<div class="row mx-0">
    <div class="text-left col-md-6 offset-md-3 mt-5">
        <form @submit.prevent="saveData">
            <div class="input-group mb-3">
                <input v-model="form.title" :class="{'is-invalid' : form.errors.has('title')}" type="text" class="form-control" aria-label="Recipient's username" aria-describedby="button-addon2" @keydown="form.errors.clear('title')">
                <button class="btn btn-success" type="submit" id="button-addon2">Add This to Your List</button>
            </div>
        </form>
        <span class="text-danger form-errors" v-if="form.errors.has('title')" v-text="form.errors.get('title')"></span>
        <div class="todolist">
            <div v-for="todo in todos" :key="todo.id" class="p-2">
                <label class="switch">
                    <input v-on:click="toggleTodo(todo)" type="checkbox" :checked="todo.completed == true">
                    <span class="slider round"></span>
                </label>
                <div class="d-inline">
                    <p v-if="editmode == false || editmode != todo.id" class="d-inline ml-2 font-weight-bold">{{todo.title}}</p>
                    <input v-if="editmode == todo.id" class="d-inline w-50" type="text" v-model="todo.title">
                    <span v-if="title_error != null" class="text-danger form-errors">{{title_error}}</span>
                </div>
                <i v-on:click="deleteTodo(todo)" class="float right delete-todo fa fa-trash-o" aria-hidden="true"></i>
                <i v-on:click="editmode = todo.id" v-if="editmode != todo.id" class="float-right edit-todo fa fa-pencil-square-o" aria-hidden="true"></i>
                <i v-if="editmode == todo.id" v-on:click="updateTodo(todo)" class="float-right update-todo fa fa-check-square-o" aria-hidden="true"></i>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data(){
        return{
            editmode: false,
            title_error:'',
            todos:'',
            form:new Form({
                title:'',
            })
        }
    },
    methods:{
        deleteTodo(e){
            let data = new FormData();
            axios.post('/api/tododelete/'+e.id, data)
            .then((res)=>{
                this.todos = res.data
            })
            .catch((err)=>{
                this.form.errors.record(err.response.data.errors)
            })
        },
        updateTodo(e){
            this.editmode = false
            let data = new FormData();
            data.append('title',e.title)
            axios.post('/api/todo/'+e.id,data)
            .then(()=>{
                this.title_error = ""
            })
            .catch((err)=>{
                this.editmode = true
                this.title_error = "Title is Must"
            })
        },
        toggleTodo(e){
            e.completed = !e.completed
            let data = new FormData();
            if(e.completed == true){
                data.append('completed',1)
            }
            if(e.completed == false){
                data.append('completed',0)
            }
            axios.post('/api/todo/'+e.id, data)
        },
        getTodo(){
            axios.get('/api/todo')
            .then((res) =>{
                this.todos = res.data
            })
            .catch((err)=>{
                console.log(err);
            })
        },
        saveData(){
            let data = new FormData();
            data.append('title', this.form.title)
            axios.post('/api/todo', data).then((res) =>{
                this.form.reset()
                this.getTodo()
            })
            .catch((err)=>{
               this.form.errors.record(err.response.data.errors)
            })
        }
    },
    mounted(){
        this.getTodo()
        axios.get('https://api.coindesk.com/v1/bpi/currentprice.json/')
       .then(response => {
        console.log(response.data)
      })
        .catch((err)=>{
            console.log(err);
        })
    }
}
</script>

<style>
.form-errors{
    font-size: 15px;
}
.todoform{
    padding: 7rem;
}
.todolist{
    background: white;
    border-radius: 7px;
    padding: 17px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
.edit-todo{
    color: orange;
    font-size: 2rem;
    cursor: pointer;
    margin-right: 14px;
}
.delete-todo{
    float: right;
    color: red;
    font-size: 2rem;
    cursor: pointer;
}
.update-todo{
    color: green;
    font-size: 2rem;
    cursor: pointer;
    margin-right: 14px;
}
</style>