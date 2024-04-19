"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { createClient } from "@/utils/supabase/client";
import { FileObject } from "@supabase/storage-js";
import { useRouter } from "next/navigation";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";

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

const AdminBoardForm = () => {
  const supabase = createClient();
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

  const router = useRouter()

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
        window.location.reload();
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

  if (fetchLoading || fetchLettersLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container max-w-screen-md p-8 md:p-16">
      <div className="mb-8">
        <h1 className="mb-4">Hallituksen kokousten pöytäkirjat</h1>
        <div className="md:mx-8">
          <table className="mb-8">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Päivämäärä</th>
              <th scope="col">Pöytäkirja</th>
              <th scope="col"></th>
            </tr>
            {boardFiles.map((file, index) => {
              if (file.name === ".emptyFolderPlaceholder") return false;
              const [year, month, day] = file.name
                .replace("-kokous.pdf", "")
                .split("-");
              const date = `${day}.${month}.${year}`;
              return (
                <>
                  <tr>
                    <td>{index}</td>
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
                    <td>
                      <IoTrash
                        onClick={() =>
                          handleDelete("hallitus", `poytakirjat/${file.name}`)
                        }
                        className="cursor-pointer hover:text-orange text-grey text-2xl"
                      />
                    </td>
                  </tr>
                </>
              );
            })}
          </table>
          {showConfirmation && (
            <div className="fixed top-0 left-0 w-full h-full backdrop:bg-gray-800/50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-xl mb-4">
                  Haluatko varmasti poistaa tiedoston?
                </h2>
                <div className="flex justify-end">
                  <button
                    onClick={cancelDelete}
                    className="mr-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Peruuta
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orangehover"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
          {!showAddBoardForm && (
            <button
              onClick={() => setShowAddBoardForm(!showAddBoardForm)}
              className="flex gap-2 items-center px-4 py-2 bg-blue text-white rounded-lg hover:bg-bluehover"
            >
              <FaPlus />
              Lisää tiedosto
            </button>
          )}

          {showAddBoardForm && (
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
                  <div className="flex justify-end lg:w-2/3 mt-4">
                    <button
                      onClick={() => cancel("poytakirjat")}
                      className="mr-2 px-4 py-2 text-white bg-grey rounded-lg hover:bg-greyhover"
                    >
                      Peruuta
                    </button>
                    <button
                      onClick={() => save("hallitus", "poytakirjat")}
                      className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orangehover"
                    >
                      Tallenna
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mb-8">
        <h1 className="mb-4">Sihteerikirjeet</h1>
        <div className="md:mx-8">
          <table className="mb-8">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Päivämäärä</th>
              <th scope="col">Sihteerikirje</th>
              <th scope="col"></th>
            </tr>
            {letters.map((file, index) => {
              if (file.name === ".emptyFolderPlaceholder") return false;
              const [year, month, day] = file.name
                .replace("-sihteerikirje.pdf", "")
                .split("-");
              const date = `${day}.${month}.${year}`;
              return (
                <>
                  <tr>
                    <td>{index}</td>
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
                  </tr>
                </>
              );
            })}
          </table>
          {showConfirmation && (
            <div className="fixed top-0 left-0 w-full h-full backdrop:bg-gray-800/50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-xl mb-4">
                  Haluatko varmasti poistaa tiedoston?
                </h2>
                <div className="flex justify-end">
                  <button
                    onClick={cancelDelete}
                    className="mr-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Peruuta
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orangehover"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowAddLetterForm(!showAddLetterForm)}
            className="flex gap-2 items-center px-4 py-2 bg-blue text-white rounded-lg hover:bg-bluehover"
          >
            <FaPlus />
            Lisää tiedosto
          </button>

          {showAddLetterForm && (
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
                  <div className="flex justify-end lg:w-2/3 mt-4">
                    <button
                      onClick={() => cancel("sihteerikirjeet")}
                      className="mr-2 px-4 py-2 text-white bg-grey rounded-lg hover:bg-greyhover"
                    >
                      Peruuta
                    </button>
                    <button
                      onClick={() => save("hallitus", "sihteerikirjeet")}
                      className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orangehover"
                    >
                      Tallenna
                    </button>
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

export default AdminBoardForm;
