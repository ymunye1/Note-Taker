const express = require ('express')
const notesArray = require ('./db/notesArray.json')
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 4000;
const path = require ('path')

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'))

//Get reqest


app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    
    console.info(`${req.method} request received to get notes`)
    return res.json(notesArray);
});

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//Post request

app.post('/api/notes', (req, res) => {
        console.info(`${req.method} request received to add new notes`)
        
        //Preparing a response object to send back to client
    
        let response;
    
        const {title, text} = res.body;
    
        if (req.body && req.body.title) {
            const newNotes = {
                title,
                text,
                id: uuidv4(),
            };

            const noteString = JSON.stringify(newNotes);
            
            response = {
                status: 'success',
                data: req.body,
            };
            notesArray.push(req.body);
            console.info(uuidv4());
            res.json(`A New Notes for ${response.data.title} has been created`);
            
        }else {
            res.json('New Note was not added');
        }
    
        console.log(req.body);
        
    });
// app.post('/api/notes', (req, res) => {
//     console.info(`${req.method} request received to add new notes`)
    
//     //Preparing a response object to send back to client

//     let response;


//     if (req.body && req.body.title){
//         response = {
//             status: 'success',
//             data: req.body,
//         };
//         notesArray.push(req.body);
//         console.info(uuidv4());
//         res.json(`A New Notes for ${response.data.title} has been created`);
        
//     }else {
//         res.json('New Note was not added');
//     }

//     console.log(req.body);
    
// });

app.listen (PORT, () => console.log(`Listening successfully on port (${PORT})`));