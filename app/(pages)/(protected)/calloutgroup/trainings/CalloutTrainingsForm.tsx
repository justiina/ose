"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import FilledButton from "@/app/components/Buttons";
import {
  deleteCalloutTraining,
  getCalloutTrainings,
  saveCalloutTraining,
  updateCalloutTraining,
} from "@/app/actions";
import { CalloutTrainingType } from "@/app/components/Types";
import { MultiDropdown } from "@/app/components/Dropdown";
import { groupOptions } from "@/app/components/StyleMappingAndOptions";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdOutlineEdit, MdOutlineToday } from "react-icons/md";
import { addYears, subYears } from "date-fns";
import { RiArrowGoBackLine } from "react-icons/ri";

type PropsType = {
  admin: boolean;
};

const CalloutGroupForm: React.FC<PropsType> = ({ admin }) => {
  const [currentTrainingsDate, setCurrentTrainingsDate] = useState<Date>(
    new Date()
  );

  const currentTrainingsYear = currentTrainingsDate.getFullYear();
  const thisYear = new Date().getFullYear();

  const [fetchTrainingsLoading, setFetchTrainingsLoading] =
    useState<boolean>(true);

  const [showAddTrainingsForm, setShowAddTrainingsForm] =
    useState<boolean>(false);

  const [trainings, setTrainings] = useState<CalloutTrainingType[]>([]);
  const [newTraining, setNewTraining] = useState<CalloutTrainingType | null>(
    null
  );

  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null); // Track the row being edited
  const [editedTraining, setEditedTraining] =
    useState<CalloutTrainingType | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchTrainingsData = async () => {
      try {
        const trainingsData = await getCalloutTrainings();
        if (trainingsData !== undefined) {
          if ("error" in trainingsData) {
            toast.error(trainingsData.error, { id: "fetchError" });
          } else {
            const trainingsArray: CalloutTrainingType[] = trainingsData.map(
              (doc) => doc as CalloutTrainingType
            );
            setTrainings(trainingsArray);
            setFetchTrainingsLoading(false);
          }
        }
      } catch (error: any) {
        toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
          id: "fetchError2",
        });
      }
    };
    fetchTrainingsData();
  }, []);

  const filteredTrainings = trainings.filter((file) => {
    const year = parseInt(file.date.split("-")[0]);
    return year === currentTrainingsYear;
  });

  const handleDelete = (trainingId: string | null) => {
    if (trainingId !== null) {
      setShowConfirmation(true);
      setDeleteId(trainingId);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const deleteOk = await deleteCalloutTraining(deleteId);
      if (deleteOk) {
        // Remove the deleted training from the state
        setTrainings((prevTrainings) =>
          prevTrainings.filter((training) => training.id !== deleteId)
        );
        // Hide the confirmation dialog
        setShowConfirmation(false);
      } else {
        toast.error(deleteOk, { id: "delError" });
        return;
      }
    }
  };

  const handleEdit = (index: number, training: CalloutTrainingType) => {
    setShowEdit(!showEdit);
    setEditRowIndex(index);
    setEditedTraining({ ...training });
  };

  const cancelEdit = () => {
    setShowEdit(false);
    setEditRowIndex(null);
    setEditedTraining(null);
  };

  const saveEditedTraining = async () => {
    if (editedTraining && editRowIndex !== null) {
      const saveOk = await updateCalloutTraining(editedTraining);
      if (saveOk) {
        // Update existing training with the updated one
        setTrainings((prevTrainings) => {
          const sortedTrainings = [...prevTrainings]
            .map((training) =>
              training.id === editedTraining.id ? editedTraining : training
            )
            // Sort the trainings by date
            .sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateA.getTime() - dateB.getTime();
            });
          return sortedTrainings;
        });
        setShowEdit(false);
        setEditRowIndex(null);
        setEditedTraining(null);
        toast.success("Muutokset tallennettu!");
      } else {
        toast.error("Muutosten tallentaminen epäonnistui", { id: "saveError" });
      }
    }
  };

  const cancel = () => {
    setNewTraining(null);
    setShowAddTrainingsForm(false);
  };

  // Save training data to Supabase
  const saveTraining = async () => {
    if (!newTraining?.date || !newTraining.organiser) {
      toast.error("Täytä ainakin pakolliset kentät!");
      return;
    }

    const saveOk = await saveCalloutTraining(newTraining);
    if (saveOk) {
      // Update the trainings state with the new training
      setTrainings((prevTrainings) => {
        // Create new training object with saved data
        const updatedTrainings = [...prevTrainings, newTraining];

        // Sort the updated array by date
        const sortedTrainings = updatedTrainings.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });

        // Update the state with the sorted array
        return sortedTrainings;
      });

      // Clear the form and reset the state
      setNewTraining(null);
      setShowAddTrainingsForm(false);
      toast.success("Tietojen tallentaminen onnistui!");
    } else {
      toast.error(saveOk, { id: "saveError" });
      return;
    }
  };

  const handleInputChange =
    (fieldName: keyof CalloutTrainingType) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      if (showEdit && editRowIndex !== null) {
        setEditedTraining((prevTraining) => ({
          ...(prevTraining as CalloutTrainingType),
          [fieldName]: e.target.value,
        }));
      } else {
        setNewTraining((prevTraining) => ({
          ...(prevTraining as CalloutTrainingType),
          [fieldName]: e.target.value,
        }));
      }
    };

  const handleDropdownSelect = (selected: string[]) => {
    if (showEdit && editRowIndex !== null) {
      setEditedTraining((prevTraining) => ({
        ...(prevTraining as CalloutTrainingType),
        organiser: selected,
      }));
    } else {
      setNewTraining((prevTraining) => ({
        ...(prevTraining as CalloutTrainingType),
        organiser: selected,
      }));
    }
  };

  const goToPreviousYear = () => {
    setCurrentTrainingsDate(subYears(currentTrainingsDate, 1));
  };

  const goToNextYear = () => {
    setCurrentTrainingsDate(addYears(currentTrainingsDate, 1));
  };

  const goToToday = () => {
    setCurrentTrainingsDate(new Date());
  };

  if (fetchTrainingsLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container p-8 lg:p-16">
      {/*---Callout Trainings---*/}
      <div className="mb-8">
        <div className="mb-4 flex justify-center gap-4 md:gap-8 col-span-9 md:col-span-10">
          <button
            onClick={goToPreviousYear}
            className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
          >
            <IoIosArrowBack className="text-2xl" />
          </button>
          <div className="flex gap-2">
            <h1 className="text-center">Hälytreenit {currentTrainingsYear}</h1>
            <button
              onClick={goToToday}
              className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
            >
              <MdOutlineToday className="text-2xl" />
            </button>
          </div>
          {Number(thisYear) > Number(currentTrainingsYear) ? (
            <button
              onClick={goToNextYear}
              className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
            >
              <IoIosArrowForward className="text-2xl" />
            </button>
          ) : (
            <div className="flex items-center justify-center h-8 w-8 rounded-full text-greylight">
              <IoIosArrowForward className="text-2xl" />
            </div>
          )}
        </div>
        <div className="md:mx-8">
          <table className="mb-8">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Päivämäärä</th>
                <th scope="col">Järjestäjä</th>
                <th scope="col">Koirajohto 1</th>
                <th scope="col">Koirajohto 2</th>
                {admin && <th scope="col">Muokkaa</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTrainings.map((training, index) => {
                const [year, month, day] = training.date.split("-");
                const date = `${day}.${month}.${year}`;
                const fileNum = index + 1;
                return (
                  <tr key={index}>
                    <td>{fileNum}</td>
                    <td>
                      {showEdit && editRowIndex === index ? (
                        <div className="border border-grey bg-white rounded-lg py-1 px-4">
                          <input
                            type="date"
                            value={editedTraining?.date || ""}
                            onChange={handleInputChange("date")}
                          />
                        </div>
                      ) : (
                        date
                      )}
                    </td>
                    <td>
                      {showEdit && editRowIndex === index ? (
                        <div className="border border-grey bg-white rounded-lg py-1 px-4">
                          <MultiDropdown
                            options={groupOptions}
                            onSelect={handleDropdownSelect}
                            value={editedTraining?.organiser || []}
                          />
                        </div>
                      ) : (
                        training.organiser.join(", ")
                      )}
                    </td>
                    <td>
                      {showEdit && editRowIndex === index ? (
                        <input
                          className="border border-grey bg-white rounded-lg py-1 px-4"
                          type="text"
                          value={editedTraining?.dogHead1 || ""}
                          onChange={handleInputChange("dogHead1")}
                        />
                      ) : (
                        training.dogHead1
                      )}
                    </td>
                    <td>
                      {showEdit && editRowIndex === index ? (
                        <input
                          className="border border-grey bg-white rounded-lg py-1 px-4"
                          type="text"
                          value={editedTraining?.dogHead2 || ""}
                          onChange={handleInputChange("dogHead2")}
                        />
                      ) : (
                        training.dogHead2
                      )}
                    </td>
                    {admin && (
                      <td>
                        {showEdit && editRowIndex === index ? (
                          <>
                            <button
                              className="mr-2 p-1 py-1 px-3 rounded-lg text-grey border-2 border-grey hover:text-white hover:bg-grey active:text-white active:bg-grey"
                              onClick={cancelEdit}
                            >
                              Peru
                            </button>
                            <button
                              className="py-1 px-3 rounded-lg text-green border-2 border-green hover:text-white hover:bg-green active:text-white active:bg-green"
                              onClick={saveEditedTraining}
                            >
                              Tallenna
                            </button>
                          </>
                        ) : (
                          <div className="flex gap-2">
                            <IoTrash
                              onClick={() => handleDelete(training.id)}
                              className="cursor-pointer hover:text-orange text-grey text-2xl"
                            />
                            <MdOutlineEdit
                              onClick={() => handleEdit(index, training)}
                              className="cursor-pointer hover:text-orange text-grey text-2xl"
                            />
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {showConfirmation && admin && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-xl mb-4">
                  Haluatko varmasti poistaa tämän harjoituksen?
                </h2>
                <div className="flex justify-end gap-2">
                  <FilledButton
                    onClick={cancelDelete}
                    title="Peruuta"
                    color="grey"
                  />
                  <FilledButton
                    onClick={confirmDelete}
                    title="OK"
                    color="orange"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between">
            <FilledButton
              onClick={() => router.push("/calloutgroup")}
              icon={<RiArrowGoBackLine className="text-2xl" />}
              title="Takaisin"
              color="grey"
            />
            {admin && (
              <FilledButton
                onClick={() => setShowAddTrainingsForm(!showAddTrainingsForm)}
                icon={<FaPlus />}
                title="Lisää treeni"
                color="blue"
              />
            )}
          </div>
          {showAddTrainingsForm && admin && (
            <div className="my-4 bg-white rounded-lg p-4 border border-grey">
              <>
                <h2 className="mb-2 text-blue">Häytreenin lisäys</h2>
                {/*---Date---*/}
                <div className="flex flex-col lg:w-2/3">
                  <div className="flex gap-1">
                    <label className="font-bold">Hälytreenin päivä</label>
                    <p className="text-orange">*</p>
                  </div>
                  <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
                    <input
                      id="dateTraining"
                      name="dateTraining"
                      aria-label="Date of the training"
                      type="date"
                      onChange={handleInputChange("date")}
                    />
                  </div>
                </div>

                {/*---Organiser---*/}
                <div className="flex flex-col lg:w-2/3">
                  <div className="flex gap-1">
                    <label className="font-bold">Järjestävä ryhmä</label>
                    <p className="text-orange">*</p>
                  </div>
                  <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
                    <MultiDropdown
                      options={groupOptions}
                      onSelect={handleDropdownSelect}
                    />
                  </div>
                </div>

                {/*---Head of the dog search 1---*/}
                <div className="flex flex-col lg:w-2/3">
                  <label className="font-bold">Koirajohto 1</label>
                  <input
                    id="dogHead1"
                    className="border border-grey bg-white rounded-lg py-1 px-4 mb-2"
                    type="text"
                    name="dogHead1"
                    placeholder="Etunimi Sukunimi"
                    onChange={handleInputChange("dogHead1")}
                    required
                  />
                </div>

                {/*---Head of the dog search 2---*/}
                <div className="flex flex-col lg:w-2/3">
                  <label className="font-bold">Koirajohto 2</label>
                  <input
                    id="dogHead1"
                    className="border border-grey bg-white rounded-lg py-1 px-4 mb-2"
                    type="text"
                    name="dogHead1"
                    placeholder="Etunimi Sukunimi"
                    onChange={handleInputChange("dogHead2")}
                    required
                  />
                </div>

                {/*---Save or cancel---*/}
                <div className="flex justify-end lg:w-2/3 mt-4 gap-2">
                  <FilledButton onClick={cancel} title="Peruuta" color="grey" />
                  <FilledButton
                    onClick={saveTraining}
                    title="Tallenna"
                    color="orange"
                  />
                </div>
              </>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalloutGroupForm;
