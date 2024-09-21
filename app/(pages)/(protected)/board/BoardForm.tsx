"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { createClient } from "@/utils/supabase/client";
import { addYears, subYears } from "date-fns";
import { FileObject } from "@supabase/storage-js";
import { useRouter } from "next/navigation";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import FilledButton from "@/app/components/Buttons";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdOutlineToday } from "react-icons/md";

type FileType = {
  title: string;
  url: string;
};

type UploadInfoType = {
  filename: string;
  title: string;
};

type DeleteFileType = {
  bucket: string;
  path: string;
};

type PropsType = {
  admin: boolean;
};

const BoardForm: React.FC<PropsType> = ({ admin }) => {
  const supabase = createClient();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentLetterDate, setCurrentLetterDate] = useState<Date>(new Date());
  const currentYear = currentDate.getFullYear();
  const currentLetterYear = currentLetterDate.getFullYear();
  const thisYear = new Date().getFullYear();

  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [fetchLettersLoading, setFetchLettersLoading] = useState<boolean>(true);

  const [showAddBoardForm, setShowAddBoardForm] = useState<boolean>(false);
  const [showAddLetterForm, setShowAddLetterForm] = useState<boolean>(false);

  const [fileNameBoard, setFileNameBoard] = useState<string>("");
  const [fileNameLetter, setFileNameLetter] = useState<string>("");

  const [uploadBoardFile, setUploadBoardFile] = useState<File | null>(null);
  const [uploadLetterFile, setUploadLetterFile] = useState<File | null>(null);

  const [boardUploading, setBoardUploading] = useState<boolean>(false);
  const [letterUploading, setLetterUploading] = useState<boolean>(false);

  const [boardFiles, setBoardFiles] = useState<FileObject[]>([]);
  const [letters, setLetters] = useState<FileObject[]>([]);

  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [deleteFile, setDeleteFile] = useState<DeleteFileType | null>(null);

  const router = useRouter();

  useEffect(() => {
    const getBoardFiles = async () => {
      const { data, error } = await supabase.storage
        .from("hallitus")
        .list("poytakirjat", { sortBy: { column: "name", order: "asc" } });

      if (data !== null) {
        setBoardFiles(data);
        setFetchLoading(false);
      } else {
        console.log(error);
        toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
          id: "uploadError",
        });
      }
    };
    const getLetterFiles = async () => {
      const { data, error } = await supabase.storage
        .from("hallitus")
        .list("sihteerikirjeet", { sortBy: { column: "name", order: "asc" } });
      if (data !== null) {
        setLetters(data);
        setFetchLettersLoading(false);
      } else {
        console.log(error);
        toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
          id: "uploadError",
        });
      }
    };

    getBoardFiles();
    getLetterFiles();
  }, []);

  const filteredBoardFiles = boardFiles.filter((file) => {
    const year = parseInt(file.name.split("-")[0]);
    return year === currentYear;
  });

  const filteredLetters = letters.filter((file) => {
    const year = parseInt(file.name.split("-")[0]);
    return year === currentLetterYear;
  });

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "datetimeBoard") {
      const date = e.target.value;
      setFileNameBoard(`${date}-kokous.pdf`);
    } else if (e.target.id === "datetimeLetter") {
      const date = e.target.value;
      setFileNameLetter(`${date}-sihteerikirje.pdf`);
    }
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("Valitse tiedosto, jotta voit ladata sen sivustolle.", {
        id: "loadError",
      });
    } else if (e.target.id === "board") {
      const file = e.target.files[0];
      setUploadBoardFile(file);
    } else if (e.target.id === "letter") {
      const file = e.target.files[0];
      setUploadLetterFile(file);
    }
  };

  const goToFileUrl = async (bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 1800); // url expires in 30min
    if (error) {
      toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
        id: "urlError",
      });
    }
    if (data) {
      router.push(data.signedUrl);
    }
  };

  const handleDelete = async (bucket: string, path: string) => {
    setShowConfirmation(true);
    setDeleteFile({ ...deleteFile, bucket: bucket, path: path });
  };

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
        if (
          deleteFile.bucket === "hallitus" &&
          deleteFile.path.startsWith("poytakirjat")
        ) {
          setBoardFiles((prevFiles) =>
            prevFiles.filter(
              (file) =>
                file.name !== deleteFile.path.replace("poytakirjat/", "")
            )
          );
        } else if (
          deleteFile.bucket === "hallitus" &&
          deleteFile.path.startsWith("sihteerikirjeet")
        ) {
          setLetters((prevFiles) =>
            prevFiles.filter(
              (file) =>
                file.name !== deleteFile.path.replace("sihteerikirjeet/", "")
            )
          );
        }
        setShowConfirmation(false);
        setDeleteFile(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setDeleteFile(null);
  };

  const cancel = (folder: string) => {
    if (folder === "poytakirjat") {
      setShowAddBoardForm(!showAddBoardForm);
      setFileNameBoard("");
    } else if (folder === "sihteerikirjeet") {
      setShowAddLetterForm(!showAddLetterForm);
      setFileNameLetter("");
    }
  };

  const save = async (bucket: string, folder: string) => {
    if (folder === "poytakirjat") {
      try {
        // Check that all the required info is provided
        if (fileNameBoard === "" || uploadBoardFile === null) {
          toast.error("Täytä päivämäärä ja muista lisätä tiedosto!", {
            id: "infoError",
          });
        } else {
          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(`${folder}/${fileNameBoard}`, uploadBoardFile);
          if (uploadError) {
            if (uploadError.message === "The resource already exists") {
              toast.error(
                "Samalle kokouspäivämäärälle voi tällä hetkellä lisätä vain yhden tiedoston. Valitse tarvittaessa eri päivämäärä.",
                { id: "uploadError" }
              );
            } else {
              toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
                id: "uploadError",
              });
            }
          } else {
            toast.success("Tiedoston tallentaminen onnistui!");
            setShowAddBoardForm(false);
            window.location.reload();
          }
        }
      } catch (error) {
        console.log(error);
        toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
          id: "uploadError2",
        });
      } finally {
        setBoardUploading(false);
      }
    } else if (folder === "sihteerikirjeet") {
      try {
        // Check that all the required info is provided
        if (fileNameLetter === "" || uploadLetterFile === null) {
          toast.error("Täytä päivämäärä ja muista lisätä tiedosto!", {
            id: "infoError",
          });
        } else {
          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(`${folder}/${fileNameLetter}`, uploadLetterFile);
          if (uploadError) {
            if (uploadError.message === "The resource already exists") {
              toast.error(
                "Samalle päivämäärälle voi tällä hetkellä lisätä vain yhden tiedoston. Valitse tarvittaessa eri päivämäärä.",
                { id: "uploadError" }
              );
            } else {
              toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
                id: "uploadError",
              });
            }
          } else {
            toast.success("Tiedoston tallentaminen onnistui!");
            setShowAddLetterForm(false);
            window.location.reload();
          }
        }
      } catch (error) {
        console.log(error);
        toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
          id: "uploadError2",
        });
      } finally {
        setLetterUploading(false);
      }
    }
  };

  const goToPreviousYear = (from: string) => {
    if (from === "board") {
      setCurrentDate(subYears(currentDate, 1));
    } else if (from === "letters") {
      setCurrentLetterDate(subYears(currentLetterDate, 1));
    }
  };

  const goToNextYear = (from: string) => {
    if (from === "board") {
      setCurrentDate(addYears(currentDate, 1));
    } else if (from === "letters") {
      setCurrentLetterDate(addYears(currentLetterDate, 1));
    }
  };

  const goToToday = (from: string) => {
    if (from === "board") {
      setCurrentDate(new Date());
    } else if (from === "letters") {
      setCurrentLetterDate(new Date());
    }
  };

  if (fetchLoading || fetchLettersLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container max-w-screen-md p-8 lg:p-16">
      <div className="mb-8">
        <div className="mb-4 flex justify-center gap-4 md:gap-8 col-span-9 md:col-span-10">
          <button
            onClick={() => goToPreviousYear("board")}
            className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
          >
            <IoIosArrowBack className="text-2xl" />
          </button>
          <div className="flex gap-2">
            <h1 className="text-center">
              Hallituksen kokouspöytäkirjat {currentYear}
            </h1>
            <button
              onClick={() => goToToday("board")}
              className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
            >
              <MdOutlineToday className="text-2xl" />
            </button>
          </div>
          {Number(thisYear) > Number(currentYear) ? (
            <button
              onClick={() => goToNextYear("board")}
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
          <table className="mb-8 ">
            <thead>
              <tr>
                <th className="bg-green text-white" scope="col">
                  #
                </th>
                <th className="bg-green text-white" scope="col">
                  Päivämäärä
                </th>
                <th className="bg-green text-white" scope="col">
                  Pöytäkirja
                </th>
                {admin && <th className="bg-green text-white" scope="col"></th>}
              </tr>
            </thead>
            <tbody>
              {filteredBoardFiles.map((file, index) => {
                if (file.name === ".emptyFolderPlaceholder") return false;
                const [year, month, day] = file.name
                  .replace("-kokous.pdf", "")
                  .split("-");
                const date = `${day}.${month}.${year}`;
                const fileNum = index + 1;
                return (
                  <tr key={index}>
                    <td>{fileNum}</td>
                    <td>{date}</td>
                    <td>
                      <button
                        className="text-blue"
                        onClick={() =>
                          goToFileUrl("hallitus", `poytakirjat/${file.name}`)
                        }
                        key={index}
                      >
                        pdf
                      </button>
                    </td>
                    {admin && (
                      <td>
                        <IoTrash
                          onClick={() =>
                            handleDelete("hallitus", `poytakirjat/${file.name}`)
                          }
                          className="cursor-pointer hover:text-orange text-grey text-2xl"
                        />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!showAddBoardForm && admin && (
            <div className="flex justify-end">
              <FilledButton
                onClick={() => setShowAddBoardForm(!showAddBoardForm)}
                icon={<FaPlus />}
                title="Lisää tiedosto"
                color="blue"
              />
            </div>
          )}

          {showAddBoardForm && admin && (
            <div className="my-4 bg-white rounded-lg p-4 border border-grey">
              {boardUploading ? (
                "Ladataan ..."
              ) : (
                <>
                  <h2 className="mb-2 text-blue">Uuden pöytäkirjan lisäys</h2>
                  <p className="mb-4">
                    HUOM! Tällä hetkellä onnistuu vain pdf-tiedostojen
                    lisääminen.
                  </p>
                  {/*---Choose the file---*/}
                  <div className="flex flex-col mb-4">
                    <div className="flex gap-1">
                      <label className="font-bold">
                        Valitse tiedosto (pdf)
                      </label>
                      <p className="text-orange">*</p>
                    </div>
                    <input
                      type="file"
                      id="board"
                      name="board"
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                  </div>
                  {/*---Date---*/}
                  <div className="flex flex-col lg:w-2/3">
                    <div className="flex gap-1">
                      <label className="font-bold">Kokouspäivämäärä</label>
                      <p className="text-orange">*</p>
                    </div>
                    <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
                      <input
                        id="datetimeBoard"
                        name="datetimeBoard"
                        aria-label="Date and time"
                        type="date"
                        onChange={handleDateChange}
                      />
                    </div>
                  </div>
                  {/*---Save or cancel---*/}
                  <div className="flex justify-end lg:w-2/3 mt-4 gap-2">
                    <FilledButton
                      onClick={() => cancel("poytakirjat")}
                      title="Peruuta"
                      color="grey"
                    />
                    <FilledButton
                      onClick={() => save("hallitus", "poytakirjat")}
                      title="Tallenna"
                      color="orange"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mb-8">
        <div className="mb-4 flex justify-center gap-4 md:gap-8 col-span-9 md:col-span-10">
          <button
            onClick={() => goToPreviousYear("letters")}
            className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
          >
            <IoIosArrowBack className="text-2xl" />
          </button>
          <div className="flex gap-2">
            <h1 className="text-center">Sihteerikirjeet {currentLetterYear}</h1>
            <button
              onClick={() => goToToday("letters")}
              className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-full hover:bg-grey hover:text-background"
            >
              <MdOutlineToday className="text-2xl" />
            </button>
          </div>
          {Number(thisYear) > Number(currentLetterYear) ? (
            <button
              onClick={() => goToNextYear("letters")}
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
              <th className="bg-green text-white" scope="col">
                #
              </th>
              <th className="bg-green text-white" scope="col">
                Päivämäärä
              </th>
              <th className="bg-green text-white" scope="col">
                Sihteerikirje
              </th>
              {admin && <th className="bg-green text-white" scope="col"></th>}
            </tr>
            </thead>
            <tbody>

            {filteredLetters.map((file, index) => {
              if (file.name === ".emptyFolderPlaceholder") return false;
              const [year, month, day] = file.name
              .replace("-sihteerikirje.pdf", "")
              .split("-");
              const date = `${day}.${month}.${year}`;
              const fileNum = index + 1;
              return (
                <tr key={index}>
                    <td>{fileNum}</td>
                    <td>{date}</td>
                    <td>
                      <button
                        className="text-blue"
                        onClick={() =>
                          goToFileUrl(
                            "hallitus",
                            `sihteerikirjeet/${file.name}`
                          )
                        }
                        key={index}
                      >
                        pdf
                      </button>
                    </td>
                    {admin && (
                      <td>
                        <IoTrash
                          onClick={() =>
                            handleDelete(
                              "hallitus",
                              `sihteerikirjeet/${file.name}`
                            )
                          }
                          className="cursor-pointer hover:text-orange text-grey text-2xl"
                          />
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
                  Haluatko varmasti poistaa tiedoston?
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
          {admin && (
            <div className="flex justify-end">
              <FilledButton
                onClick={() => setShowAddLetterForm(!showAddLetterForm)}
                icon={<FaPlus />}
                title="Lisää tiedosto"
                color="blue"
              />
            </div>
          )}
          {showAddLetterForm && admin && (
            <div className="my-4 bg-white rounded-lg p-4 border border-grey">
              {letterUploading ? (
                "Ladataan ..."
              ) : (
                <>
                  <h2 className="mb-2 text-blue">
                    Uuden sihteerikirjeen lisäys
                  </h2>
                  <p className="mb-4">
                    HUOM! Tällä hetkellä onnistuu vain pdf-tiedostojen
                    lisääminen.
                  </p>
                  {/*---Choose the file---*/}
                  <div className="flex flex-col mb-4">
                    <div className="flex gap-1">
                      <label className="font-bold">
                        Valitse tiedosto (pdf)
                      </label>
                      <p className="text-orange">*</p>
                    </div>
                    <input
                      type="file"
                      id="letter"
                      name="letter"
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                  </div>
                  {/*---Date---*/}
                  <div className="flex flex-col lg:w-2/3">
                    <div className="flex gap-1">
                      <label className="font-bold">Päiväys</label>
                      <p className="text-orange">*</p>
                    </div>
                    <div className="col-span-6 border border-grey bg-white rounded-lg py-1 px-4 mb-2">
                      <input
                        id="datetimeLetter"
                        name="datetimeLetter"
                        aria-label="Date and time"
                        type="date"
                        onChange={handleDateChange}
                      />
                    </div>
                  </div>
                  {/*---Save or cancel---*/}
                  <div className="flex justify-end lg:w-2/3 mt-4 gap-2">
                    <FilledButton
                      onClick={() => cancel("sihteerikirjeet")}
                      title="Peruuta"
                      color="grey"
                    />
                    <FilledButton
                      onClick={() => save("hallitus", "sihteerikirjeet")}
                      title="Tallenna"
                      color="orange"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardForm;
