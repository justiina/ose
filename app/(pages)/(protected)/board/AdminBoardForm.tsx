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

const AdminBoardForm = () => {
  const supabase = createClient();
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [showAddBoardForm, setShowAddBoardForm] = useState<boolean>(false);
  const [showAddLetterForm, setShowAddLetterForm] = useState<boolean>(false);
  const [fileNameBoard, setFileNameBoard] = useState<string>("");
  const [uploadBoardFile, setUploadBoardFile] = useState<File | null>(null);
  const [boardUploading, setBoardUploading] = useState<boolean>(false);
  const [uploadLetterInfo, setUploadLetterInfo] = useState<UploadInfoType>({
    filename: "",
    title: "",
  });
  const [files, setFiles] = useState<FileObject[]>([]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const getFiles = async () => {
      const { data, error } = await supabase.storage
        .from("hallitus")
        .list("poytakirjat", { sortBy: { column: "name", order: "asc" } });

      if (data !== null) {
        setFiles(data);
        setFetchLoading(false);
      } else {
        console.log(error);
        toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
          id: "uploadError",
        });
      }
    };
    getFiles();
  }, []);

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFileNameBoard(`${date}-kokous.pdf`);
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("Valitse tiedosto, jotta voit ladata sen sivustolle.", {
        id: "loadError",
      });
    } else {
      const file = e.target.files[0];
      setUploadBoardFile(file);
    }
  };

  const goToFileUrl = async (fileName: string) => {
    const { data, error } = await supabase.storage
      .from("hallitus")
      .createSignedUrl(`poytakirjat/${fileName}`, 1800); // url expires in 30min
    if (error) {
      toast.error("Jotain meni vikaan!\nYritä myöhemmin uudestaan.", {
        id: "urlError",
      });
    }
    if (data) {
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleDelete = async (fileName: string) => {
    setShowConfirmation(true);
    setDeleteId(fileName);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const { error } = await supabase.storage
        .from("hallitus")
        .remove([`poytakirjat/${deleteId}`]);

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
    setDeleteId(null);
  };

  const cancel = () => {
    setShowAddBoardForm(!showAddBoardForm);
    setFileNameBoard("");
  };

  const save = async () => {
    // Check that all the required info is provided
    try {
      setBoardUploading(true);
      if (fileNameBoard === "" || uploadBoardFile === null) {
        toast.error("Täytä kaikki kentät!", { id: "infoError" });
      } else {
        const { error: uploadError } = await supabase.storage
          .from("hallitus")
          .upload(`poytakirjat/${fileNameBoard}`, uploadBoardFile);
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
          toast.success("Tapahtuman tallentaminen onnistui!");
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
  };

  if (fetchLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container max-w-screen-md p-8 md:p-16">
      <div className="mb-8">
        <h1 className="mb-4">Hallituksen kokousten pöytäkirjat</h1>
        <div className="mx-8">
          <table className="mb-8">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Päivämäärä</th>
              <th scope="col">Pöytäkirja</th>
              <th scope="col"></th>
            </tr>
            {files.map((file, index) => {
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
                        onClick={() => goToFileUrl(file.name)}
                        key={index}
                      >
                        pdf
                      </button>
                    </td>
                    <td>
                      <IoTrash
                        onClick={() => handleDelete(file.name)}
                        className="cursor-pointer hover:text-orange text-grey text-2xl"
                      />
                    </td>
                  </tr>
                </>
              );
            })}
          </table>
          {showConfirmation && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
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
                  <h2 className="mb-2 text-orange">Uuden pöytäkirjan lisäys</h2>
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
                        id="datetimeInput"
                        aria-label="Date and time"
                        type="date"
                        onChange={handleDateChange}
                      />
                    </div>
                  </div>
                  {/*---Save or cancel---*/}
                  <div className="flex justify-end lg:w-2/3 mt-4">
                    <button
                      onClick={cancel}
                      className="mr-2 px-4 py-2 text-white bg-grey rounded-lg hover:bg-greyhover"
                    >
                      Peruuta
                    </button>
                    <button
                      onClick={save}
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
        <div className="mx-8">
          <div className="mb-4">
            <h2>Sihteerikirje 1/2024</h2>
            <h2>Sihteerikirje 2/2024</h2>
            <h2>Sihteerikirje 3/2024</h2>
          </div>
          <button
            onClick={() => setShowAddLetterForm(!showAddLetterForm)}
            className="flex gap-2 items-center px-4 py-2 bg-blue text-white rounded-lg hover:bg-bluehover"
          >
            <FaPlus />
            Lisää tiedosto
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBoardForm;
