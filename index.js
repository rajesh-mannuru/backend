const { application } = require('express');
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
];
//At the end of the function body the next function that was passed as a parameter is called.
//next function yields control to the next middleware

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
const app = express();
//All the middlewares are used using .use method and executes in the order of given sequence
//express.json is a middleware to parse the raw json data in the request object
app.use(express.json());
app.use(cors());

//if we place the requestlogger above the express.json then request logger 
//would not be able to log request body correctly because it's not parsed yet
//using custom middleware requestLogger defined above

//app.use(requestLogger);

app.get('/',(request,response) => {
  response.end('<h1 style="color:blue;">hello from the backend</h1>');
})

app.get('/api/notes',(request,response) => {
  response.json(notes);
})

app.get('/api/notes/:id',(request,response) => {
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end()
  }
})


app.put('/api/notes/:id', (request,response) => {
  const id = Number(request.params.id);
  const updatedNote = request.body;
   
  if(!notes.some(note => note.id === id)) {
    return response.status(400).json({
      error: 'note not found'
    });
  }
  notes = notes.map(note => note.id === id ? updatedNote : note);
  response.json(updatedNote);
})

app.delete('/api/notes/:id', (request,response) => {
  const id = Number(request.params.id);
  console.log('id', id);
  notes = notes.filter(note => note.id !== id)
  console.log(notes);
  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0 ?
  Math.max(...notes.map(note => note.id)) : 0;
  return maxId + 1;
}

app.post('/api/notes',(request,response) => {
  const body = request.body;
  if (!body.content) {
    // response.statusMessage = 'custom status message test';
    return response.status(400).json({
      error: 'content missing'
    });
  }
  const note = {
    content: body.content,
    important: body.important,
    date: new Date(),
    id: generateId()  
  };

  notes = notes.concat(note);
  response.json(note)
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});