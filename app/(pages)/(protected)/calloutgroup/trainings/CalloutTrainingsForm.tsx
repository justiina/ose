"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { createClient } from "@/utils/supabase/client";
import { FileObject } from "@supabase/storage-js";
import { useRouter } from "next/navigation";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import FilledButton, { FilledLink } from "@/app/components/Buttons";
import { getCalloutTrainings, saveCalloutTraining } from "@/app/actions";
import { CalloutTrainingType } from "@/app/components/Types";
import { MultiDropdown } from "@/app/components/Dropdown";
import { groupOptions } from "@/app/components/StyleMappingAndOptions";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdOutlineToday } from "react-icons/md";
import { addYears, subYears } from "date-fns";
import { GoBellFill } from "react-icons/go";

type DeleteFileType = {
  bucket: string;
  path: string;
};

type PropsType = {
  admin: boolean;
};

const CalloutGroupForm: React.FC<PropsType> = ({ admin }) => {
  const supabase = createClient();
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
  const [deleteFile, setDeleteFile] = useState<DeleteFileType | null>(null);

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

  const confirmDelete = async () => {
    if (deleteFile) {
      const { error } = await supabase.storage
        .from(deleteFile.bucket)
        .remove([deleteFile.path]);

      if (error) {
        toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
          id: "delError",
        });
      } else {
        toast.success("Tiedoston poistaminen onnistui!", { id: "delSuccess" });
        window.location.reload();
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setDeleteFile(null);
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
    } else {
      const saveOk = await saveCalloutTraining(newTraining);
      if (saveOk) {
        window.location.reload();
        toast.success("Tapahtuman tallentaminen onnistui!");
      } else {
        toast.error(saveOk, { id: "saveError" });
        return;
      }
    }
  };

  const handleInputChange =
    (fieldName: keyof CalloutTrainingType) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewTraining((prevTraining) => ({
        ...(prevTraining as CalloutTrainingType),
        [fieldName]: e.target.value,
      }));
    };

  const handleDropdownSelect = (selected: string[]) => {
    setNewTraining((prevTraining) => ({
      ...(prevTraining as CalloutTrainingType),
      organiser: selected,
    }));
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
            <tr>
              <th scope="col">#</th>
              <th scope="col">Päivämäärä</th>
              <th scope="col">Järjestäjä</th>
              <th scope="col">Koirajohto 1</th>
              <th scope="col">Koirajohto 2</th>
              {admin && <th scope="col"></th>}
            </tr>
            {filteredTrainings.map((training, index) => {
              const [year, month, day] = training.date.split("-");
              const date = `${day}.${month}.${year}`;
              const fileNum = index + 1;
              return (
                <>
                  <tr>
                    <td>{fileNum}</td>
                    <td>{date}</td>
                    <td>
                      {training.organiser?.map((group, index) => (
                        <p key={index}>{group}</p>
                      ))}
                    </td>
                    <td>{training.dogHead1}</td>
                    <td>{training.dogHead2}</td>
                    {admin && (
                      <td>
                        <IoTrash
                          onClick={() => {}}
                          className="cursor-pointer hover:text-orange text-grey text-2xl"
                        />
                      </td>
                    )}
                  </tr>
                </>
              );
            })}
          </table>
          {showConfirmation && admin && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-xl mb-4">
                  Haluatko varmasti poistaa tiedoston?
                </h2>
                <div className="flex justify-end gap-2">
                  <FilledButton
                    onClick={cancelDelete}
                    title="Peruuta"
                    color="greylight"
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
          {admin && (
            <div className="flex justify-end">
              <FilledButton
                onClick={() => setShowAddTrainingsForm(!showAddTrainingsForm)}
                icon={<FaPlus />}
                title="Lisää treeni"
                color="blue"
              />
            </div>
          )}
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
