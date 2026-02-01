
function GeometryShapePattern() {
  return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col justify-center items-center">
                <div className="w-[10vw] h-[10vw] rounded-l-[4rem] bg-[#880d1e]"></div>
                <div className="relative w-[10vw] h-[10vw]">
                    <div className="absolute top-0 w-full h-[12%] bg-[#f5cb5c]"></div>
                    <div className="absolute h-full w-[12%] left-0 bg-[#f5cb5c]"></div>
                    <div className="absolute h-full w-[12%] right-0 bg-[#f5cb5c]"></div>
                    <div className="absolute bottom-0 w-full h-[12%] bg-[#f5cb5c]"></div>
                </div>
                <div className="w-[10vw] h-[10vw] rounded-l-[4rem] rounded-t-[4rem] bg-[#b9c6ae]"></div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="w-[10vw] h-[10vw] flex justify-center items-center">
                    <div className="w-[7vw] h-[7vw] bg-[#f58f29] rotate-45"></div>
                </div>
                <div className="w-[10vw] h-[10vw] z-1 rounded-full bg-[#8cb369]"></div>
                <div className="relative w-[10vw] h-[10vw]">
                    <div className="absolute h-[110%] w-[10%] bottom-0 -left-1 bg-[#754668] origin-bottom rotate-27 rounded-4xl"></div>
                    <div className="absolute h-[110%] w-[10%] bottom-0 -right-1 bg-[#754668] origin-bottom -rotate-27 rounded-4xl"></div>
                    <div className="absolute bottom-0 w-full h-[10%] bg-[#754668] rounded-4xl"></div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="w-[10vw] h-[10vw] bg-[#156064] rounded-tr-full"></div>
                <div className="w-[10vw] h-[10vw] bg-[#156064] rounded-br-full"></div>
                <div className="w-[10vw] h-[10vw] bg-[#754668] rounded-tr-full"></div>
            </div>
        </div>
  )
}

export default GeometryShapePattern