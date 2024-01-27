import { Item, ItemAccess } from "../api/items/route";

const User = async () => {
  let items: Item[] = [];
  const response = await fetch(`${process.env.API_URL}/api/items`);
  if (response.ok) {
    const itemsJson = await response.json();
    if (itemsJson && itemsJson.length > 0) items = itemsJson;
  }

  return (
    <div>
      <h1 className="text-white text-xl mb-10">UserPage</h1>
      {items.map((item) => {
        return (
          <div
            key={item.id}
            className="flex items-center justify-between w-full gap-20 bg-slate-700 mt-2 px-2 text-white"
          >
            <p>{item.title}</p>
            <span
              className={`${
                item.access === ItemAccess.ADMIN
                  ? "bg-orange-400"
                  : item.access === ItemAccess.USER
                  ? "bg-emerald-400"
                  : "bg-slate-400"
              } text-white text-xs px-2 py-2 rounded-full`}
            >
              {" "}
              {item.access}
            </span>
          </div>
        );
      })}
    </div>
  );

}

export default User