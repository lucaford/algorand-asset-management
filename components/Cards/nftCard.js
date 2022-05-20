import Image from "next/image";

export const NftCard = ({ asset }) => {
  const { params } = asset;
  
  return (
    <div className="card bg-[#15263F] w-80 h-[32rem] rounded-xl p-6 space-y-4">
      <div className="relative h-52 w-full">
        <Image
          className="rounded-md transition hover:bg-cyan-300"
          src={params.url}
          alt=""
          layout="fill"
        />
      </div>
      <div id="description" className="space-y-4">
        <a href="#">
          <h2 className="text-white font-semibold text-xl transition hover:text-cyan-300">
            {params.name} #{asset.index}
          </h2>
        </a>
        {/* <p className="text-slate-500 text-sm select-none">
          Our Equilibrium collection promotes balance and calm.
        </p> */}
        <div className="flex items-center justify-between font-semibold text-sm border-b border-slate-500 pb-6">
          <span
            id="price"
            className="text-cyan-300 flex justify-between items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 320 512"
              fill="#67E7F9"
            >
              <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
            </svg>
            0 ALGO
          </span>
        </div>
        <div className="flex text-sm items-center">
          <span className="ml-2 text-slate-500">
            Creation of{" "}
            <a
              href="#"
              className="text-gray-300 transition hover:text-cyan-300"
            >
              {params.creator.substring(0, 6)}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};
