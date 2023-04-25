import React, { useEffect, useState } from "react";
import { 
  GetAllTheatres, 
  UpdateTheatre,
  DeleteTheatre,
  GetAllTheatresByOwner } from "../../apicalls/theatres";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { message, Table } from "antd";
import Button from "../../components/Button";
import TheatreForm from "./TheatreForm";
import Shows from "./Shows";

function TheatresList() {
  const [theatres,setTheatres] = useState([]);
  const dispatch = useDispatch();
  const [formType,setFormType] = useState("add");
  const [showTheatreFormModal,setShowTheatreFormModal]=useState(false);
  const [selectedTheatre,setSelectedTheatre] = useState(null);
  const [openShowsModal,setOpenShowsModal] = useState(false);

  const getData = async ()=>{
    try {
      dispatch(ShowLoading());
      const response = await GetAllTheatres();
      if(response.success){
        setTheatres(response.data);
      }else{
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }

  const handleStatusChange = async (theatre)=>{
    try {
      dispatch(ShowLoading());
      const response = await UpdateTheatre({
        theatreId : theatre._id,
        ...theatre,
        isActive : !theatre.isActive
      });
      if(response.success){
        message.success(response.message);
        getData();
      }else{
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }

  const handleDelete = async (id)=>{
    try {
      dispatch(ShowLoading());
      const response = await DeleteTheatre({
        theatreId: id
      });
      if(response.success){
        message.success(response.message);
        getData();
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
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (text, record) => {
        return record.owner.name;
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (text, record) => {
        if (text) {
          return "Approved";
        } else {
          return "Pending / Blocked";
        }
      },
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   render: (text, record) => {
    //     return (
    //       <div className="flex gap-1">
    //         {record.isActive && (
    //           <span
    //             className="underline"
    //             onClick={() => handleStatusChange(record)}
    //           >
    //             Block
    //           </span>
    //         )}
    //         {!record.isActive && (
    //           <span
    //             className="underline"
    //             onClick={() => handleStatusChange(record)}
    //           >
    //             Approve
    //           </span>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1 items-center">
            <i
              className="ri-delete-bin-line"
              onClick={() => {
                handleDelete(record._id);
              }}
            ></i>
            <i
              className="ri-pencil-line"
              onClick={() => {
                setFormType("edit");
                setSelectedTheatre(record);
                setShowTheatreFormModal(true);
              }}
            ></i>

            {record.isActive && (
              <span
                className="underline"
                onClick={() => {
                  setSelectedTheatre(record);
                  setOpenShowsModal(true);
                }}
              >
                Shows
              </span>
            )}
          </div>
        );
      },
    }
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
       <div className="flex justify-end mb-1">
        <Button
          variant="outlined"
          title="Add Theatre"
          onClick={() => {
            setFormType("add");
            setSelectedTheatre(null);
            setShowTheatreFormModal(true);
          }}
        />
      </div>
      <Table columns={columns} dataSource={theatres} />
        {showTheatreFormModal && (
        <TheatreForm
          showTheatreFormModal={showTheatreFormModal}
          setShowTheatreFormModal={setShowTheatreFormModal}
          formType={formType}
          setFormType={setFormType}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          getData={getData}
        />
      )}

      {openShowsModal && (
        <Shows
          openShowsModal={openShowsModal}
          setOpenShowsModal={setOpenShowsModal}
          theatre={selectedTheatre}
        />
      )}
    </div>
  )
}

export default TheatresList