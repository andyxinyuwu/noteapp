var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const {Store, Note} = require('./notes.js')

var app = express();
var store = new Store();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Create a new note
app.post('/create', function(req, res, next) {
	body = req.body;
	var note = new Note(body.title, body.text)
	store.writeNote(note)
	res.status(200).send('created note id: ' + note.id)
});

// Update a notes title
app.post('/updatetitle/:id', function(req, res, next) {
	var id = req.params.id;
	var newTitle = req.body.title
	note = store.getNote(id)
	if (note == 'undefined' || note == null) {
		return next(createError(404));
	}

	note.title = newTitle;
	store.writeNote(note);
	res.status(200).send('Note ' + id + ' is updated to title: ' + newTitle)
});

// Update a notes message
app.post('/updatemessage/:id', function(req, res, next) {
	var id = req.params.id;
	var newMessage = req.body.message
	note = store.getNote(id);
	if (note == 'undefined' || note == null) {
		return next(createError(404));
	}

	note.message = newMessage;
	store.writeNote(note);
	res.status(200).send('Note ' + id + ' is updated to message: ' + newMessage)
});

// Delete a note
app.delete('/delete/:id', function(req, res, next) {
	var id = req.params.id;
	try {
		store.deleteNote(id);
		res.status(200).send('Note ' + id + ' is deleted.')
	}
	catch (err) {
		return next(createError(404));
	}
});

// Get a note by id
app.get('/get/:id', function(req, res, next) {
	var id = req.params.id;
	note = store.getNote(id)
	if (note == 'undefined' || note == null) {
		return next(createError(404));
	}

	json = new Object()
	json[note.title] = note.message;
	res.status(200).json(json);
});

// Get all notes
app.get('/getall', function(req, res, next) {
	notes = store.getNotes();
	json = new Object()
	for(var i = 0; i < notes.length; i ++) {
		json[notes[i].title] = notes[i].message
	}
	res.status(200).json(json);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
