const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();
const PORT =90;

let students = {
    list : [
        {id:1,name:"Kaa",major:"CoE",gpa:3.67},
        {id:2,name:"Paa",major:"CoE",gpa:3.79}
    ]
    
}
app.use(cors());
app.use('/api',bodyParser.json(),router);
app.use('/api',bodyParser.urlencoded({extended:false}),router);


router.route('/students')
 .get ((req,res)=>{
     res.json(students);
 })

 .post ((req,res)=>{
    let id = (students.list.length)?students.list[students.list.length-1].id+1:1
     let name = req.body.name
     let major = req.body.major
     let gpa = req.body.gpa
     students.list = [...students.list,{id,name,major,gpa}]
     res.json(students);
 })

 router.route('/students/:std_id')
  .get((req,res)=>{
    let id = students.list.findIndex((item) => (item.id === +req.params.std_id))
    res.json(students.list[id]);
  })

  .put((req,res)=>{
      let id = students.list.findIndex((item) => (item.id === +req.params.std_id))
      students.list[id].name = req.body.name
      students.list[id].major = req.body.major
      students.list[id].gpa = req.body.gpa
      res.json(students)
  })

  .delete((req,res)=>{
      students.list = students.list.filter((item) => item.id !== +req.params.std_id)
      res.json(students);
  })


 app.listen(PORT,()=> console.log('Server running on  ',PORT))