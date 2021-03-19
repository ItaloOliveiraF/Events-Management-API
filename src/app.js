const express = require("express");
const {v4: uuidv4} = require("uuid");

const app = express();
app.use(express.json());

//Bases de dados fakes
const users = [];
const events = [];
const tickets = [];

//Middlewares
function checksEventExists(request, response, next){
    const { eventId } = request.params;

    const eventIndex = events.findIndex((event) => {
        return event.id === eventId}
        );

    if(eventIndex < 0){
        return response.status(404).json({error: "Event not found!"})
    }

    request.eventIndex = eventIndex;

    return next();
}

function checksUserExists(request, response, next){
    const { userid: userId } = request.headers;

    const userIndex = users.findIndex((user) => {
        return user.id === userId
    });

    if(userIndex < 0){
        return response.status(404).json({error: "User not found!"})
    }

    request.userIndex = userIndex;

    return next();
}

function checksAvailableTickets(request, response, next){
    const { eventIndex } = request;

    const event = events[eventIndex];

    if(event.totalAmountOfTickets === undefined){
        return next();
    }

    const totalAmountOfTickets = events[eventIndex].totalAmountOfTickets
    const soldTickets = tickets.length === 0 ? 0 : tickets.reduce((acc, ticket) => {
        console.log(acc)
        if (ticket.eventId === event.id){
            return acc + 1
        }
        return acc
    }, 0) 
    const availableTickets = totalAmountOfTickets - soldTickets;

    if (availableTickets <= 0){ 
        return response.status(400).json( {error : "No more tickets available!"})
    }

    return next();
}

function checkTicketExists(request, response, next){
    const { userIndex, eventIndex } = request;

    const userId = users[userIndex].id;
    const eventId = events[eventIndex].id;

    const ticketIndex = tickets.findIndex((ticket) => ticket.userId === userId && ticket.eventId === eventId)

    if (ticketIndex < 0){
        return response.status(404).json( {error : "Ticket not found!"} )
    }

    request.ticketIndex = ticketIndex;

    return next();
}

app.post('/users', (request, response)=>{
    const { name, email } = request.body;

    const userAlreadyExists = users.some((user) => user.email === email)
    
    if(userAlreadyExists){
        return response.status(400).json({error: "User already exists!"})
    }

    const user = {
        id: uuidv4(),
        name,
        email,
        created_at: new Date()
    }

    users.push(user);

    return response.status(201).json(user);
})

app.get('/users', (request, response) => {
    return response.status(200).json(users);
})

app.post('/events', (request, response) => {
    const { name, description, location, date, price, type, totalAmountOfTickets } = request.body;

    let formattedDate = date.split("/")
    formattedDate.reverse();
    formattedDate.join("-");

    formattedDate = new Date(`${formattedDate} 00:00`)

    const event = {
        id: uuidv4(),
        name,
        description,
        location,
        date: formattedDate,
        price,
        type,
        totalAmountOfTickets,
        created_at: new Date()
    }

    events.push(event);

    return response.status(201).json(event);
})

app.get('/events', (request, response) => {
    const { nameFilter } = request.query;

    if(!nameFilter){
        return response.status(200).json(events);
    }

    const eventList = events.filter(
        (event) => event.name.toLowerCase().includes(nameFilter.toLowerCase())
        )

    return response.status(200).json(eventList);
});

app.get('/events/:eventId', checksEventExists, (request, response) => {
    const { eventIndex } = request;
    
    return response.status(200).json(events[eventIndex]);
});

app.put('/events/:eventId', checksEventExists, (request, response) => {
    const { name, description, location, date, price, type, totalAmountOfTickets } = request.body;
    const { eventIndex } = request;

    let updatedEvent = {}

    if(name != undefined) {updatedEvent.name = name} 
    if(description != undefined) {updatedEvent.description = description} 
    if(location != undefined) {updatedEvent.location = location} 
    if(price != undefined) {updatedEvent.price = price}
    if(type != undefined) {updatedEvent.type = type}
    if(totalAmountOfTickets != undefined) {updatedEvent.totalAmountOfTickets = totalAmountOfTickets}
    if(date){
        let formattedDate = date.split("/")
        formattedDate.reverse();
        formattedDate.join("-");
        formattedDate = new Date(`${formattedDate} 00:00`)

        updatedEvent.date = formattedDate; 
    }

    events[eventIndex] = {...events[eventIndex], ...updatedEvent}

    return response.status(200).json(events[eventIndex]);
})

app.delete('/events/:eventId', checksEventExists, (request, response) => {
    const { eventIndex } = request;

    const removedEvent = events.splice(eventIndex, 1);

    return response.status(200).json(removedEvent);
})

app.post('/tickets/:eventId',checksEventExists, checksUserExists, checksAvailableTickets, (request, response) => {
    const { userIndex, eventIndex } = request;

    const userId = users[userIndex].id;
    const eventId = events[eventIndex].id;
    
    const ticket = {
        id: uuidv4(),
        userId,
        eventId,
        checkPayment: false,
        created_at: new Date()
    }

    tickets.push(ticket)

    return response.status(201).json(ticket)
})

app.get('/tickets', (request, response) => {
    return response.json(tickets);
})

app.get('/tickets/events/:eventId', checksEventExists, (request, response) => {
    const { eventId } = request.params;

    const ticketsList = tickets.filter((ticket) => ticket.eventId === eventId)

    return response.json(ticketsList);
})

app.get('/tickets/users/:userId', (request, response) => {
    const { userId } = request.params;

    const user = users.find((user) => {
        return user.id === userId
    });

    if(!user){
        return response.status(404).json({error: "User not found!"})
    }

    const ticketsList = tickets.filter((ticket) => ticket.userId === userId)

    return response.json(ticketsList);
})

app.patch('/tickets/:eventId', checksEventExists, checksUserExists,
 checkTicketExists, (request, response) => {
     const { ticketIndex } = request;

     const ticket = tickets[ticketIndex];

     ticket.checkPayment = true;

     tickets[ticketIndex] = ticket;

     return response.status(204).send('OK');
 })

app.delete('/tickets/:eventId', checksEventExists, checksUserExists,
checkTicketExists, (request, response) => {
    const { ticketIndex } = request;

    const removedTicket = tickets.splice(ticketIndex, 1);

    return response.status(200).json(removedTicket);
})

module.exports = {
    app,
    users,
    tickets,
    events,
    checkTicketExists,
    checksAvailableTickets,
    checksEventExists,
    checksUserExists
}