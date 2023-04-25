import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { message, Table } from "antd";
import Button from "../../components/Button";
import { GetAllBookings } from "../../apicalls/bookings";
import moment from "moment";

function BookingList() {
    const dispatch = useDispatch();
    const [bookingList,setBookingList] = useState([]);
    const [openBookingModal,setOpenBookingModal] = useState(false);
    const [selectedBooking,setSelectedBooking] = useState(null);
    const getData = async ()=>{
    try {
      dispatch(ShowLoading());
      const response = await GetAllBookings();
      if(response.success){
        setBookingList(response.data);
      }else{
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }
   const columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      render : (text,record)=>{
         return (
                    <img
                        src={record.show.movie.poster}
                        alt="poster"
                        height="60"
                        width="80"
                        className="br-1"
                    />
                )
        }
    },
    {
      title: "Show",
      dataIndex: "name",
      render : (text,record)=>{
        return record.show.name;
      }
    },
    {
      title: "Date",
      dataIndex: "date",
      render : (text,record)=>{
        return moment(record.show.date).format("DD-MM-YYYY");
      }
    },
    {
      title: "Movie",
      dataIndex: "title",
      render : (text,record)=>{
        return record.show.movie.title;
      }
    },
    {
      title: "Theatre",
      dataIndex: "name",
      render: (text, record) => {
        return record.show.theatre.name;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => {
        return record.user.email;
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1 items-center">
           <span
                className="underline"
                onClick={() => {
                  setSelectedBooking(record);
                  setOpenBookingModal(true);
                }}
              >
                More Details
              </span>
          </div>
        );
      },
    }
  ];

   useEffect(()=>{
        getData();
    },[]);
  return (
    <div>
         <Table columns={columns} dataSource={bookingList} />
    </div>
  )
}

export default BookingList