const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())

app.get("/",(req,res)=>{
    res.json({
        "Title": "Hotel Api endpoints reference",
        "To create a room": "/add-a-new-room",
        "To book a room": "/book-room/:roomId",
        "Get all rooms information": "/list-all-rooms",
        "Get booked rooms information": "/list-booked-rooms",
        "Get customers information": "/list-customers"
    });
    res.end();
})

var rooms = [{
    id: 1,
    name: "Deluxe1",
    seats: 40,
    amenities: [ 'ac, wifi, video coverage live streaming' ],
    price_per_hour: "Rs.3000",
    booking_info: []
  }
];
let customers = [];

app.post("/add-a-new-room",(req,res)=>{
    let id  = rooms.length+1;
    let seats = req.body.seats;
    let amenities = req.body.amenities;
    let price = req.body.price;
    let booking_info = [];
    let data = {
        id: id,
        name: "Deluxe"+id,
        seats: seats,
        amenities: amenities,
        price_per_hour: "Rs."+price,
        booking_info: booking_info
    }
    rooms.push(data)
    res.json({
        message:"Successfully created a room !!",
    })
})


app.post("/book-room/:roomId",(req,res)=>{
    
    let name = req.body.name
    let date = req.body.date
    let startTime = req.body.startTime
    let endTime = req.body.endTime
    let roomId = req.params.roomId
    
    let result  = rooms.find((obj)=>obj.id == +roomId )
    console.log(result);
    if(result){
        let dateQuery  = result.booking_info.find((obj) => obj["date"] == date);
        console.log(dateQuery);
        if(dateQuery === undefined){
        let room_data = {
            name: name, 
            date: date, 
            startTime: startTime, 
            endTime: endTime,
            status: "booked"
        };
        result.booking_info.push(room_data);

        let customer_data = {
            name: name, 
            date: date, 
            startTime:startTime, 
            endTime: endTime,
            room_name: result.name
        };
        customers.push(customer_data);

        res.json({message:"Room booked !!",})
        res.end();
    } else{
        res.json({message:"Room is not available for the specified data / time ",});
        res.end();
    }
     
    }else{
        res.json({message:"Invalid room id !!",});
        res.end();
    }
  
 })
 app.get("/list-all-rooms",(req,res)=>{
    res.json(rooms);
    res.end()
});

app.get("/list-booked-rooms",(req,res)=>{
    let queryBookedRooms = rooms.filter( (obj) => obj.booking_info.length !== 0);
    if(queryBookedRooms.length == 0){
        res.send("Sorry, there are no bookings");
    } else{
        res.json(queryBookedRooms);
        res.end()
    }
});

app.get("/list-customers",(req,res)=>{
    if(customers.length == 0){
        res.send("Sorry, currently there are no customers");
    }else{
        res.json(customers);
        res.end();
    }
})

app.listen(PORT,()=>console.log(`Hotel Api server is running at port ${PORT}`))