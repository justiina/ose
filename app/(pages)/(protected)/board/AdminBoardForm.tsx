"use client";
//import { saveFile } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";

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
  const [showAddBoardForm, setShowAddBoardForm] = useState<boolean>(false);
  const [showAddLetterForm, setShowAddLetterForm] = useState<boolean>(false);
  const [uploadBoardInfo, setUploadBoardInfo] = useState<UploadInfoType>({
    filename: "",
    title: "",
  });
  const [uploadBoardFile, setUploadBoardFile] = useState<File | null>(null);
  const [boardUploading, setBoardUploading] = useState<boolean>(false);
  const [uploadLetterInfo, setUploadLetterInfo] = useState<UploadInfoType>({
    filename: "",
    title: "",
  });
  const [files, setFiles] = useState<FileType[]>([]);

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setUploadBoardInfo({ ...uploadBoardInfo, filename: `${date}-kokous.pdf` });
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

  const cancel = () => {
    setShowAddBoardForm(!showAddBoardForm);
    setUploadBoardInfo({ filename: "", title: "" });
  };

  const save = async () => {
    // Check that all the required info is provided
    try {
      setBoardUploading(true);
      if (
        uploadBoardInfo.filename === "" ||
        uploadBoardInfo.title === "" ||
        uploadBoardFile === null
      ) {
        toast.error("Täytä kaikki kentät!", { id: "infoError" });
      } else {
        const { error: uploadError } = await supabase.storage
          .from("hallitus")
          .upload(`poytakirjat/${uploadBoardInfo.filename}`, uploadBoardFile);
        if (uploadError) {
          if (uploadError.message === "The resource already exists") {
            toast.error(
              "Samalle kokouspäivämäärälle voi lisätä vain yhden tiedoston. Valitse tarvittaessa eri päivämäärä.",
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

  return (
    <div className="container max-w-screen-md p-8 md:p-16">
      <div className="mb-8">
        <h1 className="mb-4 text-orange">Hallituksen kokousten pöytäkirjat</h1>
        <div className="mx-8">
          <div className="mb-4">
            <h2>Kokous 1/2024</h2>
            <h2>Kokous 2/2024</h2>
            <h2>Kokous 3/2024</h2>
          </div>
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
                  {/*---Title---*/}
                  <h2 className="mb-2 text-orange">Uuden pöytäkirjan lisäys</h2>
                  <p className="mb-4">
                    Täytä kaikki kentät. Tällä hetkellä onnistuu vain
                    pdf-tiedostojen lisääminen.
                  </p>
                  <div className="flex flex-col lg:w-2/3">
                    <div className="flex gap-1">
                      <label className="font-bold">
                        Otsikko (tämä näkyy yllä olevassa listassa)
                      </label>
                      <p className="text-orange">*</p>
                    </div>
                    <input
                      id="title"
                      className="border border-grey bg-white rounded-lg py-1 px-4 mb-2"
                      type="text"
                      name="title"
                      placeholder="Esim. Kokous 1/2024"
                      onChange={(e) =>
                        setUploadBoardInfo({
                          ...uploadBoardInfo,
                          title: e.target.value,
                        })
                      }
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
                  {/*---Choose the file---*/}
                  <div className="flex flex-col">
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
                  {/*---Save or cancel---*/}
                  <div className="flex lg:w-2/3 justify-end mt-4">
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
        <h1 className="mb-4 text-orange">Sihteerikirjeet</h1>
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
