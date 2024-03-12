import React from "react";

const UserCard = ({user}) => {
  return (
    <>
      <div className="bg-white rounded-2xl pb-2">
        <div className="flex flex-row justify-between px-4 py-1 bg-orange text-white rounded-t-2xl">
          <h2 className="text-white">{user?.firstName}</h2>
          <button
            className="flex items-center gap-2 cursor-pointer hover:text-grey"
            onClick={() => setEdit(!edit)}
          >
            <CiEdit className="text-2xl" /> <p className="text-xs">Muokkaa</p>
          </button>
        </div>
        <div className="grid gap-2 mx-6 my-4">
          <div className="flex">
            <p className="font-bold w-5/12">Etunimi:</p>
            <p>{user?.firstName}</p>
          </div>
          <div className="flex">
            <p className="font-bold w-5/12">Sukunimi:</p>
            <p>{user?.lastName}</p>
          </div>
          <div className="flex">
            <p className="font-bold w-5/12">Sähköposti:</p>
            <p>{user?.email}</p>
          </div>
          <div className="flex">
            <p className="font-bold w-5/12">Puhelinnumero:</p>
            <p>{user?.phoneNumber}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
