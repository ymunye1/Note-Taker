const fs = require ('fs');
const express = require ('express');
const notesArray = require ('./db/notesArray.json');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require ('path');
const util = require ('util');
const res = require('express/lib/response');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'))

//Get reqest


app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received to get notes`)
    readFromFile('./db/notesArray.json').then((data) => res.json(JSON.parse(data)))
});

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//Post request

app.post('/api/notes', (req, res) => {
        console.info(`${req.method} request received to add new notes`)
        
        //Preparing a response object to send back to client
    
    
    let response;

    const {title, text} = req.body;
        
    if (req.body && req.body.title) {
        const newNotes = {
            title,
            text,
            id: uuidv4(),
        };
       
        readAndAppend(newNotes, './db/notesArray.json');
        res.status(201).json(`A New Note for ${req.body.title} has been created`);
        }else{
            res.status(500).json('Error in adding new note');
        }
            
            response = {
                status: 'success',
                data: req.body,
            };
            
            console.log(response);
          
            console.info(uuidv4());
        console.log(req.body);
});

    
app.delete('/api/notes/:id', (req, res) => {
	console.info('Deleting...');
	const noteId = req.params.id;
	readFromFile('./db/notesArray.json')
		.then((data) => JSON.parse(data))
		.then((json) => {
			// Make a new array of all notes except the one with the ID provided in the URL
			const result = json.filter((notesjs) => notesjs.id !== noteId);
			// Save that array to the filesystem
			writeToFile('./db/notesArray.json', result);
			// Respond to the DELETE request
			res.json(`Item ${noteId} has been deleted`);
		});
});


    const readFromFile = util.promisify(fs.readFile);

    // const noteString = JSON.stringify(newNotes);

    const writeToFile = (destination, content) => {
        fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
            err ? console.err(err) : console.info(`\nThe Data has been written to ${destination}`)
        );
    }

    const readAndAppend = (content, file) => {
        fs.readFile(file, 'utf-8', (err, data) =>{
            if (err){
                console.err (err);
            } else {
                const parsedData = JSON.parse(data);
                parsedData.push(content);
                writeToFile(file, parsedData);
            }
        });
    };


app.listen (PORT, () => console.log(`Listening Successfully On Port: (${PORT})`));