const request = require('supertest');
const {Store, Note} = require('./notes.js')

var mockWriteNote = jest.fn();
var mockGetNote = jest.fn();
mockGetNote.mockReturnValue({'title': '1', 'message': '2'})
var mockGetNotes = jest.fn();
mockGetNotes.mockReturnValue([{'title': '1', 'message': '2'}]);
var mockDeleteNote = jest.fn();

jest.mock('./notes');
Store.mockImplementation(() => {
	return {
				writeNote: mockWriteNote,
				getNote: mockGetNote,
				deleteNote: mockDeleteNote,
				getNotes: mockGetNotes
	};
});

app = require('./app');

afterEach(() => {
  mockGetNote.mockReturnValue({'title': '1', 'message': '2'});
});

test('It should create a note', () => {
	return request(app).post('/create').expect(200).then(response => {
		expect(mockWriteNote).toHaveBeenCalled();
	});
});

test('It should update a note title', () => {
	return request(app).post('/updatetitle/1').send('title=newTitle').then((response) => {
		expect(response.statusCode).toBe(200);
		expect(response.text).toBe('Note 1 is updated to title: newTitle');
	});
});

test('Wrong note id for update title should return 400', () => {
	mockGetNote.mockReturnValue(null);
	return request(app).post('/updatetitle/2').send('title=newTitle').then((response) => {
		expect(response.statusCode).toBe(404);
	});
});

test('It should update a note message', () => {
	return request(app).post('/updatemessage/1').send('message=newMessage').then((response) => {
		expect(response.statusCode).toBe(200);
		expect(response.text).toBe('Note 1 is updated to message: newMessage');
	});
});

test('Wrong note id for update message should return 400', () => {
	mockGetNote.mockReturnValue(null);
	return request(app).post('/updatemessage/2').send('message=newMessage').then((response) => {
		expect(response.statusCode).toBe(404);
	});
});

test('It should delete a note', () => {
	return request(app).delete('/delete/1').then((response) => {
		expect(response.statusCode).toBe(200);
		expect(mockDeleteNote).toHaveBeenCalled();
	});
});

test('It should get a note by id', () => {
	return request(app).get('/get/1').then((response) => {
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({"1": "2"})
	});
});

test('Wrong note id for get function should return 400', () => {
	mockGetNote.mockReturnValue(null);
	return request(app).get('/get/2').then((response) => {
		expect(response.statusCode).toBe(404);
	});
});

test('It should get all notes', () => {
	return request(app).get('/getall').then((response) => {
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({"1": "2"});
	});
});
